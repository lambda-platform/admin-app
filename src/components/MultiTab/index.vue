<template>
  <div class="ant-pro-multi-tab">
    <div class="ant-pro-multi-tab-wrapper">

      <a-tabs
        hideAdd
        type="editable-card"
        v-model:activeKey="activeKey"
        :tabBarStyle="{margin: 0, paddingLeft: '16px', paddingTop: '1px' }"
        @edit="onEdit"
      >
        <a-tab-pane
          v-for="page in pages"
          :key="page.path"
          :closable="pages.length > 1"
          style="height: 0"
        >
          <template #tab>
            <a-dropdown :trigger="['contextmenu']">
              <span :style="{ userSelect: 'none' }">{{page.meta.title }}</span>
              <template #overlay>
                <a-menu
                  @click="({ key, item, domEvent }) => {
                this.closeMenuClick(key, page.path);
              }"
                >
                  <a-menu-item key="closeSelf">{{ $t('multiTab.closeCurrent') }}</a-menu-item>
                  <a-menu-item key="closeRight">{{ $t('multiTab.closeRight') }}</a-menu-item>
                  <a-menu-item key="closeLeft">{{ $t('multiTab.closeLeft') }}</a-menu-item>
                  <a-menu-item key="closeAll">{{ $t('multiTab.closeAll') }}</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>

          </template>

        </a-tab-pane>
        <template #rightExtra>
          <a-tooltip placement="topLeft">
            <template #title>
              <span>{{ $t('user.save') }}</span>
            </template>
            <span :class="savedStatus === 'unsaved' ? 'btn btn-icon rounded-sm shadow' : 'btn btn-icon rounded-sm shadow btn-active'" @click="saveTab">
                <span class="svg-icon">
                     <inline-svg src="/assets/icons/duotone/General/Bookmark.svg"/>
                </span>
              </span>
          </a-tooltip>

<!--          <a-tooltip placement="topLeft">-->
<!--            <template #title>-->
<!--              <span>{{ $t('user.save') }}</span>-->
<!--            </template>-->
<!--            <span :class="savedStatus === 'unsaved' ? 'btn btn-icon rounded-sm shadow' : 'btn btn-icon rounded-sm shadow btn-active'" >-->
<!--                <span class="svg-icon">-->
<!--                     <inline-svg src="/assets/icons/duotone/Design/Position.svg"/>-->
<!--                </span>-->
<!--              </span>-->
<!--          </a-tooltip>-->
<!--          <a-button  @click="saveTab" size="small">-->
<!--            &lt;!&ndash;              <span class="svg-icon">&ndash;&gt;-->
<!--            &lt;!&ndash;                  <inline-svg src="/assets/icons/duotone/General/Bookmark.svg"/>&ndash;&gt;-->
<!--            &lt;!&ndash;              </span>&ndash;&gt;-->
<!--            {{savedStatus}}-->
<!--          </a-button>-->
        </template>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, watch, getCurrentInstance, type ComputedRef, computed } from 'vue'
import { useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import events from '~/utils/eventBus'
import { message } from 'ant-design-vue'
import { getItemPath } from '~/utils/menu'
import {i18n} from '~/locale'
import { SAVED_TABS } from '~/store/mutation-types'
import ls from '~/utils/Storage'

export default defineComponent({
  name: 'MultiTab',
  setup () {

    let fullPathList: Array<string> = []
    let savedFullPathList = ref([])
    const pages = reactive<Array<RouteLocationNormalizedLoaded>>([])
    const saved_tabs = ls.get(SAVED_TABS) || []
    const activeKey = ref('')
    const fullPath = ref('')
    const router = useRouter()
    // const { t } = i18n.global
    const {
      ctx,
      f
    } = getCurrentInstance()

    const selectedLastPath = () => {
        activeKey.value = fullPathList[fullPathList.length - 1]
    }

    ;(function created () {
      // #region
      events.once('multiTab.open', (val) => {
        if (!val) {
          throw new Error(`multi-tab: open tab ${val} err`)
        }
        activeKey.value = val
      })
      events.once('multiTab.close', (val) => {
        if (!val) {
          closeSelf(activeKey.value)
          return
        }
        closeSelf(val)
      })
      events.once('multiTab.rename', ({
        key,
        name
      }) => {

        try {
          const item = pages.find((item) => item.path === key)
          item!.meta.customTitle = name
          f()
        } catch (e) {
          console.error(e)
        }
      })
      // #endregion

      if (saved_tabs.length >= 1) {
        let fullPath = router.currentRoute.value.path
        let index = saved_tabs.findIndex(l => l.path === fullPath)

        savedFullPathList.value = [...saved_tabs.map(s=>s.path)]

        if(index >= 0){
          pages.push(...[...saved_tabs])
          fullPathList.push(...saved_tabs.map(s=>s.path))
        } else {
          fullPathList.push(...[...saved_tabs.map(s=>s.path), router.currentRoute.value.path])
          pages.push(...[...saved_tabs, router.currentRoute.value])
        }

      } else {
        pages.push(router.currentRoute.value)
        fullPathList.push(router.currentRoute.value.path)
      }
      fullPath.value = router.currentRoute.value.path

      let pIndex = pages.findIndex(p=>p.path === router.currentRoute.value.path)
      if(pIndex < 0){
        selectedLastPath()
      }else {
        activeKey.value =router.currentRoute.value.path
      }

    })()

    const onEdit = (targetKey, action) => {
      ctx[action](targetKey)
    }
    const remove = (targetKey) => {
      const temp = pages.filter((page) => page.path !== targetKey)
      pages.length = 0
      pages.push(...temp)
      fullPathList = fullPathList.filter((path) => path !== targetKey)

      if (!fullPathList.includes(activeKey.value)) {
        selectedLastPath()
      }
    }

    // content menu
    const closeSelf = (e) => {

      if (fullPathList.length > 1) {
        remove(e)
      } else {
        // message.info(t('multiTab.cannotCloseLast'))
      }
    }
    const closeLeft = (e) => {
      const currentIndex = fullPathList.indexOf(e)
      if (currentIndex > 0) {
        fullPathList.forEach((item, index) => {
          if (index < currentIndex) {
            remove(item)
          }
        })
      } else {
        // message.info(t('multiTab.noLeft'))
      }
    }
    const closeRight = (e) => {
      const currentIndex = fullPathList.indexOf(e)
      if (currentIndex < fullPathList.length - 1) {
        fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            remove(item)
          }
        })
      } else {
        // message.info(t('multiTab.noRight'))
      }
    }
    const closeAll = (e) => {
      const currentIndex = fullPathList.indexOf(e)
      fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          remove(item)
        }
      })
    }
    const closeMenuClick = (key: string, route) => {
      ctx[key](route)
    }

    const saveTab = () => {

      let savedTabs = ls.get(SAVED_TABS)

      let fullPath = router.currentRoute.value.path
      let index = fullPathList.findIndex(l => l === fullPath)

      if (index >= 0) {
        if(savedTabs === null){
          savedTabs = [];
        }

        if (savedTabs.length >= 1) {
          let savedIndex = savedTabs.findIndex(t=>t.path === fullPathList[index]);
          if(savedIndex >= 0){




            const temp = savedTabs.filter((page) => page.path !== fullPathList[index])
            savedTabs.length = 0
            savedTabs.push(...temp)

            saved_tabs.length = 0
            saved_tabs.push(...temp)


            savedFullPathList.value = [...temp.map(l=>l.path)]



            ls.set(SAVED_TABS, savedTabs)
            return
          }

        }

        let cloned = {
          fullPath:pages[index].path,
          hash:pages[index].hash,
          href:pages[index].href,
          meta:{
            title:pages[index].meta.title
          },
          name:pages[index].name,
          path:pages[index].path,
          query:{
            ...pages[index].query
          },
          params:{
            ...pages[index].params
          },
        }

        savedFullPathList.value.push(cloned.path);
        if (savedTabs.length >= 1) {

          ls.set(SAVED_TABS, [...savedTabs, cloned])
          saved_tabs.value = [...savedTabs, cloned]
        } else {


          ls.set(SAVED_TABS, [cloned])
          saved_tabs.value = [cloned]
        }
      }

    }
    watch(
      () => router.currentRoute.value,
      (newVal) => {
        activeKey.value = newVal.path
        if (fullPathList.indexOf(newVal.path) < 0) {
          fullPathList.push(newVal.path)

          pages.push(newVal)

        }

        fullPath.value = newVal.path
      }
    )

    watch(activeKey, (newPathKey) => {
      router.push({ path: newPathKey })
    })

    const savedStatus: ComputedRef<string> = computed(() => {
      let saved = "unsaved"

      let index = savedFullPathList.value.findIndex(l => l === fullPath.value)

      if(index >= 0){
        return "saved";
      }
      return saved
    });

    return {
      fullPathList,
      pages,
      activeKey,
      onEdit,
      remove,
      selectedLastPath,
      closeSelf,
      closeLeft,
      closeRight,
      closeAll,
      closeMenuClick,
      saveTab,
      savedFullPathList,
      savedStatus,
      fullPath
    }
  }
})
</script>
