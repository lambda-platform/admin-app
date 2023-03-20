<template>
  <div class="card drawer-wrappper">
    <Head>
      <Title>{{ $t('appAdmin.profile') }}</Title>
    </Head>
    <portal to="header-left">
      <div class="page-title float-left">
        <div class="float-left pt-5">
          <h1 class="text-gray-700 dark:text-gray-200 text-base m-0 ">{{ $t('appAdmin.profile') }}</h1>

        </div>
      </div>
    </portal>
    <section class="offcanvas-template">
      <div class="crud-page">
        <div class="crud-page-body">
          <div class="">
            <div class="ant-drawer-content">
              <div class="ant-drawer-wrapper-body">

                <div class="ant-drawer-body">
                  <dataform
                    ref="form"
                    :url="base_url"
                    :hideTitle="true"
                    schemaID="user_profile_user" :editMode="editMode" :do_render="editMode" :onReady="editUser"
                    :onSuccess="onSuccess"
                  >
                  </dataform>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { base_url } from '~/consts/const'
import { USER_INFO } from '~/store/mutation-types'
import ls from '../../utils/Storage'
export default {
  name: 'profile',
  data () {
    return {
      editMode: true,
      base_url:base_url
    }
  },
  methods: {
    onSuccess (data) {
    },
    editUser () {
      this.$nextTick(() => {
       let user = ls.get(USER_INFO);
        this.$refs.form.editModel(user.id);
      })

    },
  }
}
</script>
