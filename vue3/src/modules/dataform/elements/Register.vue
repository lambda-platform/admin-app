<template>
    <lambda-form-item :label=label :name="model.component" :meta="meta">


        <a-input-number
            :disabled="disabled"
            @change="registerChanged"
            class="register-field"
            v-model:value="registerNumber"
        >
            <template #addonBefore>

                <a-select
                    v-model:value="registerChar1"
                    :disabled="disabled"
                    :options="characters"
                    @change="registerChanged"
                    show-search

                >
                </a-select>
                <div style="width: 20px; display: inline-block"></div>
                <a-select
                    v-model:value="registerChar2"
                    :disabled="disabled"
                    :options="characters"
                    @change="registerChanged"
                    show-search

                >
                </a-select>

            </template>
        </a-input-number>

    </lambda-form-item>
</template>


<script>
import mixin from './_mixin'

export default {
    mixins: [mixin],
    data () {
        return {
            registerNumber: null,
            registerChar1: 'А',
            registerChar2: 'А',
            characters: [
                {
                    value: 'А',
                    label: 'А'
                },
                {
                    value: 'Б',
                    label: 'Б'
                },
                {
                    value: 'В',
                    label: 'В'
                },
                {
                    value: 'Г',
                    label: 'Г'
                },
                {
                    value: 'Д',
                    label: 'Д'
                },
                {
                    value: 'Е',
                    label: 'Е'
                },
                {
                    value: 'Ё',
                    label: 'Ё'
                },
                {
                    value: 'Ж',
                    label: 'Ж'
                },
                {
                    value: 'З',
                    label: 'З'
                },
                {
                    value: 'И',
                    label: 'И'
                },
                {
                    value: 'Й',
                    label: 'Й'
                },
                {
                    value: 'К',
                    label: 'К'
                },
                {
                    value: 'Л',
                    label: 'Л'
                },
                {
                    value: 'М',
                    label: 'М'
                },
                {
                    value: 'Н',
                    label: 'Н'
                },
                {
                    value: 'О',
                    label: 'О'
                },
                {
                    value: 'Ө',
                    label: 'Ө'
                },
                {
                    value: 'П',
                    label: 'П'
                },
                {
                    value: 'Р',
                    label: 'Р'
                },
                {
                    value: 'С',
                    label: 'С'
                },
                {
                    value: 'Т',
                    label: 'Т'
                },
                {
                    value: 'У',
                    label: 'У'
                },
                {
                    value: 'Ү',
                    label: 'Ү'
                },
                {
                    value: 'Ф',
                    label: 'Ф'
                },
                {
                    value: 'Х',
                    label: 'Х'
                },
                {
                    value: 'Ц',
                    label: 'Ц'
                },
                {
                    value: 'Ч',
                    label: 'Ч'
                },
                {
                    value: 'Ш',
                    label: 'Ш'
                },
                {
                    value: 'Щ',
                    label: 'Щ'
                },
                {
                    value: 'Ъ',
                    label: 'Ъ'
                },
                {
                    value: 'Ы',
                    label: 'Ы'
                },
                {
                    value: 'Ь',
                    label: 'Ь'
                },
                {
                    value: 'Э',
                    label: 'Э'
                },
                {
                    value: 'Ю',
                    label: 'Ю'
                },
                {
                    value: 'Я',
                    label: 'Я'
                }
            ]
        }
    },
    computed: {
        registerLocal () {
            return this.model.form[this.model.component]
        }
    },
    mounted () {
        this.init(this.model.form[this.model.component]);
    },
    watch: {
        registerLocal (value, oldValue) {

          this.init(value);
        }
    },
    methods: {
        init(value){
            if (value) {
                let firstchar = value.charAt(0)
                this.registerChar1 = {
                    value: firstchar,
                    label: firstchar
                }
                let secondchar = value.charAt(1)
                this.registerChar2 = {
                    value: secondchar,
                    label: secondchar
                }
                this.registerNumber = value.substring(2, 10)
            } else {
                this.registerNumber = null
                this.registerChar1 = 'А'
                this.registerChar2 = 'А'
            }
        },
        registerChanged () {
            if (this.registerNumber && this.registerChar1 && this.registerChar2) {
                let preFix = this.registerChar1 + this.registerChar2
                let number = this.registerNumber.toString().substring(0, 8)
                let fillRD = preFix + number

                if (this.registerNumber.length > 8) {
                    this.registerNumber = number
                } else if (fillRD.length === 10) {
                    this.model.form[this.model.component] = fillRD
                } else {
                    this.model.form[this.model.component] = null
                }
            } else {
                this.model.form[this.model.component] = null
            }

        }
    }
}
</script>
