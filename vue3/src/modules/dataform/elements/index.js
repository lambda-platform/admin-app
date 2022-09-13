import { defineAsyncComponent } from 'vue'

export const elementList = [
    {
        element: 'Text',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-text" */'./Text.vue')),
    },
    {
        element: 'Select',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Select" */'./Select.vue')),
    },
    {
        element: 'ISelect',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Select" */'./Select.vue')),
    },
    {
        element: 'TreeSelect',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-TreeSelect" */'./TreeSelect.vue')),
    },
    {
        element: 'Number',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Number" */'./Number.vue')),
    },
    {
        element: 'Textarea',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Textarea" */'./Textarea.vue')),
    },
    {
        element: 'Date',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Date" */'./Date.vue')),
    },
    {
        element: 'DateTime',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-DateTime" */'./DateTime.vue')),
    },
    {
        element: 'Divider',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Divider" */'./Divider.vue')),
    },
    {
        element: 'Image',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Image" */'./Image.vue')),
    },
    {
        element: 'ImageSubform',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-ImageSubform" */'./ImageSubform.vue')),
    },
    {
        element: 'HTML',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-HTML" */'./HTML.vue')),
    },
    {
        element: 'ImageDrag',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-ImageDrag" */'./ImageDrag.vue')),
    },
    {
        element: 'Checkbox',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Checkbox" */'./Checkbox.vue')),
    },
    {
        element: 'CK',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-CK" */'./CK.vue')),
    },
    {
        element: 'File',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-File" */'./File.vue')),
    },
    {
        element: 'FileSubform',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-ImageSubform" */'./FileSubform.vue')),
    },
    {
        element: 'Download',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Download" */'./Download.vue')),
    },
    {
        element: 'Geographic',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Geographic" */'./Geographic.vue')),
    },
    {
        element: "CkOld",
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-CK" */'./CK-old.vue')),
    },
    {
        element: "CkOldPhp7",
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-CK" */'./CK-old-php7.vue')),
    },
    {
        element: 'ColorPicker',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-ColorPicker" */'./ColorPicker.vue')),
    },
    {
        element: "Email",
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-text" */'./Text.vue')),
    },
    {
        element: 'Hidden',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Hidden" */'./Hidden.vue')),
    },
    {
        element: 'Map',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Map" */'./Map.vue')),
    },
    {
        element: 'Money',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Money" */'./Money.vue')),
    },
    {
        element: 'MoneyWithoutCurrency',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Money" */'./MoneyWithoutCurrency.vue')),
    },
    {
        element: 'NumberGenerate',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-NumberGenerate" */'./NumberGenerate.vue')),
    },
    {
        element: 'Password',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Password" */'./Password.vue')),
    },
    {
        element: 'PasswordGenerate',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-PasswordGenerate" */'./PasswordGenerate.vue')),
    },
    {
        element: 'Radio',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Radio" */'./Radio.vue')),
    },
    {
        element: 'RadioWithThumb',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Radio" */'./RadioWithThumb.vue')),
    },
    {
        element: 'FooterButton',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-FooterButton" */'./FooterButton.vue')),
    },
    {
        element: 'RadioWithTextInput',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-RadioWithTextInput" */'./RadioWithTextInput.vue')),
    },
    {
        element: 'Register',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Register" */'./Register.vue')),
    },
    {
        element: 'Search',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Search" */'./Search.vue')),
    },
    {
        element: 'Switch',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Switch" */'./Switch.vue')),
    },
    {
        element: 'Time',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Time" */'./Time.vue')),
    },
    {
        element: 'JsonEditor',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-AdminMenu" */'./JsonEditor.vue')),
    },
    {
        element: "QGis",
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-QGis" */'./QGis.vue')),
    },
    {
        element: 'AdminMenu',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-AdminMenu" */'./NotFound.vue')),
    },
    {
        element: 'GridSelector',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-GridSelector" */'./GridSelector.vue')),
    },
    {
        element: 'subform/Grid',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-sub-form-grid" */'./subform/Grid.vue')),
    },
    {
        element: 'subform/Form',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-sub-form" */'./subform/Form.vue')),
    },
]

const Notfount = defineAsyncComponent(() => import(/* webpackChunkName: "form-field-not-fount" */'./NotFound.vue'))
const CustomElement = () => import(/* webpackChunkName: "form-field-CustomElement" */'./CustomElement.vue')

const requireCustomElement = (type) => {

    try {
        return defineAsyncComponent(() => import(`../../../../../src/dataform_custom/${type}.vue`))
    } catch (exception_var) {
        console.log(exception_var)
        return CustomElement
    }
}

export const element = (type) => {

    if (type !== null && typeof type !== 'undefined') {
        const elIndex = elementList.findIndex(el => el.element === type)

        if (elIndex >= 0) {
            return elementList[elIndex].component
        }
    }

    return requireCustomElement(type);
}
