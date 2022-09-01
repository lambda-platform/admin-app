<template>
    <div class="form-content">

        <div class="logo with-text" v-if="lambda.logoText != ''">
            <img :src="lambda.logo" alt="">
            <span>{{ lambda.logoText }}</span>
        </div>
        <div class="logo" v-else>
            <img :src="lambda.logo" alt="">
        </div>
        <h2>{{ lang.loginTitle }}</h2>
        <form id="authForm" method="post" class="login-form">
            <div class="form-element input">
                <input type="text" v-model="credentials.login" :disabled="loading"
                       :placeholder="lang.username">
                <span class="icon user"></span>
            </div>
            <div class="form-element input">
                <input type="password" v-model="credentials.password" :disabled="loading"
                       :placeholder="lang.password">
                <span class="icon pass"></span>
            </div>
            <div class="form-element">
                <input type="checkbox" class="checkbox" id="remember_me">
                <label for="remember_me">{{ lang.remember }}</label>
            </div>
            <div class="form-element action">
                <a-button type="primary" :loading="loading" @click="onSubmit">{{ lang.login }}</a-button>
                <p>
                    <router-link class="forgot" to="/auth/forgot">{{ lang.forgot }}</router-link>
                </p>
            </div>
        </form>

        <div id="msg">
            <span v-if="isSuccess" class="success">{{ lang.loginSuccess }}</span>
            <span v-if="isError" class="error">{{ lang.loginError }}</span>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    props: ['lambda', 'onSuccess', 'selectedLang'],
    name: "aside-login",
    data() {
        return {
            loading: false,
            isSuccess: false,
            isError: false,
            credentials: {
                login: null,
                password: null
            },

        }
    },
    computed: {
        lang() {
            const labels = ['loginTitle', 'username', 'password', 'remember', 'login', 'forgot', 'loginSuccess', 'loginError'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('user.' + labels[i]);
                return obj;
            }, {});
        }
    },
    methods: {
        onSubmit() {
            this.isSuccess = false;
            this.isError = false;
            if (!this.loading) {
                this.loading = true;
                axios.post('/auth/login', this.credentials).then(({data}) => {
                    this.loading = false;
                    if (data.status) {
                        this.onSuccess(data)
                    } else {
                        this.isError = true;
                    }
                }).catch(e => {
                    this.loading = false;
                    this.isError = true;
                })
            }
        },

    }
}
</script>
