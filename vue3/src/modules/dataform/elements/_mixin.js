import { isValid } from '~~/vue3/src/modules/dataform/utils/methods'

export default {
    props: ['model', 'label', 'meta', 'do_render', 'editMode', 'is_show', 'relation_data', 'showInformationModal', 'url', 'setSchemaByModel', 'getSchemaByModel', 'isBuilder'],
    computed: {
        placeholder () {
            return this.meta && this.meta.placeHolder !== null && this.meta.placeHolder !== '' && this.meta.placeHolder !== undefined ? this.meta.placeHolder : this.label
        },
        disabled () {
            return this.meta && this.meta.disabled ? this.meta.disabled : false
        },
        options () {
            if (this.meta.formType === 'Radio' || this.meta.formType === 'Select' || this.meta.formType === 'ISelect' || this.meta.formType === 'TreeSelect') {
                if (isValid(this.meta) && isValid(this.meta.options) && this.meta.options.length >= 1) {
                    return this.filterOption(this.meta.options)
                } else {
                    return this.filterOption(this.relation_data(this.meta))
                }
            } else {
                return []
            }
        },
        itemValue(){
            return this.model.form[this.model.component];
        }

    },
    methods: {
        filterOption (options) {
            if (options) {
                if (this.meta.relation.parentFieldOfForm) {

                    if (this.model.form[this.meta.relation.parentFieldOfForm]) {
                        let filteredOptions = options.filter(option => option.parent_value === this.model.form[this.meta.relation.parentFieldOfForm])

                        if(this.meta.formType === 'Select' || this.meta.formType === 'ISelect' || this.meta.formType === 'TreeSelect'){
                            this.initialValue(filteredOptions)
                        }
                        return filteredOptions
                    } else {
                        return options ? options : []
                    }
                } else {
                    if(this.meta.formType === 'Select' || this.meta.formType === 'ISelect' || this.meta.formType === 'TreeSelect') {
                        this.initialValue(options)
                    }
                    return options ? options : []
                }
            }
            return []
        },

    },
    data () {
        return {}
    }

}
