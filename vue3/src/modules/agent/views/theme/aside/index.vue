<template>
    <div class="login aside-theme" :style="{ backgroundImage: 'url(' + lambda.bg + ')' }">
        <div class="content">
            <div class="content-layer"></div>
            <div class="title">
                <h2 style="max-width: 600px;">{{ title }}</h2>
                <p>{{ subTitle }}</p>
            </div>
        </div>
        <div class="auth">
            <div class="lang-switcher" v-if="lambda.has_language && languages.length >= 2">
                <a v-for="item in languages" :key="item.index"
                   :class="selectedLang == item.code ? 'active' : ''"
                   @click="switchLanguage(item.code)">
                    {{ item.label }}
                </a>
            </div>
            <div class="form-wrap">
<!--                <router-view :selectedLang="selectedLang"></router-view>-->
                <slot></slot>
                <div class="copyright" style="width:70%; text-align:center;" v-html="copyright"></div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props:["lambda", "subTitle", "languages", "copyright", "title", "selectedLang", "switchLanguage"],
    data() {
        return {
            loading: false,
            isSuccess: false,
            isError: false,
            credentials: {
                login: null,
                password: null
            }
        }
    },


}
</script>

<style lang="scss">
@import "../../../scss/theme/aside/style";
</style>

