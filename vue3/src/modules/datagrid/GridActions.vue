<template>
   <span class="grid-actions">
        <span v-for="item in params.actions" :key="item.index">
            <a-tooltip v-if="item === 'qe'">
                <template #title>{{ lang.easyEdit }}</template>
                <a-button shape="circle" size="small" @click="params.methods.quickEdit(params.value)">
                    <template #icon>
                        <EditTwoTone />
                    </template>
                </a-button>
            </a-tooltip>

            <a-tooltip v-if="item === 'cl'">
                <template #title>{{ lang.copy }}</template>
                <a-button shape="circle" size="small"
                        @click="params.methods.clone(params.value)">
                    <template #icon>
                        <CopyTwoTone />
                    </template>
                </a-button>
            </a-tooltip>


            <a-tooltip v-if="item === 'v'">
                <template #title>{{ lang.view }}</template>
                <Button shape="circle"  size="small" @click="params.methods.view(params.value)">
                    <template #icon>
                        <EyeTwoTone />
                    </template>
                </Button>
            </a-tooltip>

            <a-tooltip
                v-if="item === 'e'
            && (params.actionsVisibility==null
            || !('e' in params.actionsVisibility)
            || ('e' in params.actionsVisibility
            && params.data[params.actionsVisibility.e.field]!==params.actionsVisibility.e.value)) && isCanEdit()"
                >
                <template #title>{{ lang.edit }}</template>
                <a-button shape="circle" size="small"
                        @click="edit">
                     <template #icon>
                        <EditTwoTone />
                    </template>
                </a-button>
            </a-tooltip>

            <a-popconfirm
                v-if="item === 'd'
            && (params.actionsVisibility==null
            || !('d' in params.actionsVisibility)
            || ('d' in params.actionsVisibility
            && params.data[params.actionsVisibility.d.field]!=params.actionsVisibility.d.value))  && isCanDelete()"
                 :title="lang.ruSureYouDeleteInfo" :transfer="true"
                :ok-text="lang.yes" :cancel-text="lang.no"
                @confirm="params.methods.remove(params.value, params.rowIndex)">
                <a-button shape="circle" size="small">
                    <template #icon>
                        <DeleteTwoTone />
                    </template>
                </a-button>
            </a-popconfirm>
        </span>

        <span v-for="item in params.customActions" :key="item.index">
            <a-tooltip v-if="item.tooltip
            && (!('condition' in item)
            || params.data[item.condition.field]!==item.condition.value)"
                      placement="left">
                <template #title>{{ item.tooltip }}</template>
                <a-button shape="circle" size="small" class="grid-action-btn"
                        @click="item.method(params.data)"><i :class="item.icon"></i>
                </a-button>
            </a-tooltip>
            <a-button v-else-if="!('condition' in item)
            || params.data[item.condition.field]!==item.condition.value"
                    shape="circle" size="small"
                    class="grid-action-btn"
                    @click="item.method(params.data)">
                <i :class="item.icon"></i>
            </a-button>
        </span>
    </span>
</template>
<script>
import {isCan} from "./utils/permission"
import { EditTwoTone, DeleteTwoTone, EyeTwoTone, CopyTwoTone } from '@ant-design/icons-vue';
export default{
    components:{
        EyeTwoTone,
        CopyTwoTone,
        EditTwoTone,
        DeleteTwoTone
    },
    computed: {
        lang() {
            const labels = ['easyEdit', 'view', 'yes', 'no', 'ruSureYouDeleteInfo', 'edit',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
    },
    methods: {
        edit() {
            this.params.methods.edit(this.params.value, this.params.data)
        },

        isCanEdit() {
            if (this.params.methods.permissions) {
                if (this.params.methods.permissions.gridEditConditionJS != "" && this.params.methods.permissions.gridEditConditionJS != null && this.params.methods.permissions.gridEditConditionJS != undefined) {
                    return isCan(this.params.methods.permissions.gridEditConditionJS, this.params.data)
                }
            }
            return true;
        },

        isCanDelete() {
            if (this.params.methods.permissions) {
                if (this.params.methods.permissions.gridDeleteConditionJS != "" && this.params.methods.permissions.gridDeleteConditionJS != null && this.params.methods.permissions.gridDeleteConditionJS != undefined) {
                    return isCan(this.params.methods.permissions.gridDeleteConditionJS, this.params.data)
                }
            }

            return true;
        }
    }
};
</script>

