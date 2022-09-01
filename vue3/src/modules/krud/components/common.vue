<template>
    <portal to="header-left">
        <div class="page-title float-left">
            <div class="float-left pt-3">
                <h1 class="text-gray-700 dark:text-gray-200 text-base m-0 ">{{ title }}</h1>
                <h2 class="text-gray-400 text-xs m-0">
                        <span v-for="(p, index) in parent" :key="p.index">
                            <span v-if="index >= 1"> / </span>{{ p.title }}
                        </span>
                </h2>
            </div>
        </div>
        <div class="float-left ml-3 " v-if="!hideAction">
            <span class="divider"></span>
            <a-button type="primary" @click="addAction" shape="round">
                <template #icon>
                        <span class="anticon align-top ant-btn-svg-icon" style="vertical-align: top">
                            <inline-svg
                                src="/assets/icons/duotune/general/gen041.svg"
                            />
                        </span>
                </template>
                {{ lang._add }}
            </a-button>
        </div>
    </portal>
    <portal to="mobile-page-title">
        <div class="page-title mb-3">
            <div>
                <h1 class="text-gray-700 dark:text-gray-200 text-base m-0 ">{{ title }}</h1>
                <h2 class="text-gray-400 text-xs m-0">
                         <span v-for="(p, index) in parent" :key="p.index">
                            <span v-if="index >= 1"> / </span>{{ p.title }}
                        </span>
                </h2>
            </div>
        </div>
    </portal>
    <portal to="header-mobile" v-if="!hideAction">
        <div class="fixed bottom-14 right-2">
            <a-button type="primary" @click="addAction" shape="circle" size="large">
                <template #icon>
                      <span class="settings-btn ant-btn-svg-icon">
                        <inline-svg
                            src="/assets/icons/duotune/general/gen041.svg"
                        />
                      </span>
                </template>
            </a-button>
        </div>
    </portal>
</template>

<script>

export default {
    name: 'common',
    props:["parent", "addAction", "title", "hideAction"],

    computed:{
        lang() {
            const labels = [
                '_add',
                'Information_viewing_history','excelUpload'
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('crud.' + labels[i]);
                return obj;
            }, {});
        },
    }
}
</script>
