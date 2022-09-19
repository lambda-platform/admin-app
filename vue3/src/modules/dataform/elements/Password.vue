<template>
    <div>
        <a-form-item :label="lang.currentPassword" name="current_password" v-if="meta.passwordOption.edit_with_old_password">
            <a-input-password v-model:value="model.form['current_password']" password
                              :placeholder="lang.currentPassword"
            />
        </a-form-item>
        <lambda-form-item  :label=label :name="model.component" :meta="meta">
            <a-input-password v-model:value="model.form[model.component]" password
                :placeholder="placeholder"
                :disabled="disabled">
                <template #addonAfter>
                    <a-tooltip slot="append" v-if="meta.passwordOption.generate">
                        <template #title>{{ lang.Create_a_password }}</template>
                        <span class="svg-icon " @click="generatePass()">
                        <inline-svg
                            src="/assets/icons/duotone/Home/Key.svg"
                        />
                    </span>

                    </a-tooltip>
                </template>
            </a-input-password>

        </lambda-form-item>
        <a-form-item :label="lang.confirmPassword" name="password_confirm"
                     v-if="meta.passwordOption.confirm">
            <a-input-password :type="passwordGenerated ? 'text': 'password'"
                              v-model:value="model.form['password_confirm']"
                              :placeholder="lang.confirmPassword"
            />
        </a-form-item>
    </div>
</template>

<script>
import mixin from './_mixin'

export default {
    mixins: [mixin],
    computed: {
        lang () {
            const labels = ['currentPassword', 'confirmPassword', 'Create_a_password', '_pass']
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i])
                return obj
            }, {})
        },
    },
    data () {

        return {
            passwordGenerated: false,
        }
    },
    methods: {
        generatePass () {
            let charactersArray = ['a-z', 'A-Z', '0-9', '#']
            let CharacterSet = ''
            let password = ''

            if (charactersArray.indexOf('a-z') >= 0) {
                CharacterSet += 'abcdefghijklmnopqrstuvwxyz'
            }
            if (charactersArray.indexOf('A-Z') >= 0) {
                CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            }
            if (charactersArray.indexOf('0-9') >= 0) {
                CharacterSet += '0123456789'
            }
            if (charactersArray.indexOf('#') >= 0) {
                CharacterSet += '!{}()%&*$#^<>~@|'
            }
            for (let i = 0; i < 8; i++) {
                password += CharacterSet.charAt(Math.floor(Math.random() * CharacterSet.length))
            }
            this.model.form[this.model.component] = password
            if (this.meta.passwordOption.confirm) {
                this.model.form['password_confirm'] = password
            }
            this.passwordGenerated = true
        }
    }
}
</script>
