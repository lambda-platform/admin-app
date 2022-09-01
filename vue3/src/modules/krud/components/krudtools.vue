<template>
    <div class="crud-page-header-right-inside action">
        <a-tooltip>
            <template #title>
                {{lang._save}}
            </template>
            <a @click="$props.save" class="btnLine" v-if="isSave">
                <i class="ti-save"></i>
            </a>
        </a-tooltip>
        <a-tooltip>
            <template #title>
                {{lang.re_call}}
            </template>
            <a @click="$props.refresh" class="btnLine" v-if="isRefresh">
                <i class="ti-reload"></i>
            </a>
        </a-tooltip>
        <a-tooltip v-if="isPrint">
            <template #title>
                {{lang._print}}
            </template>
            <span class="btn btn-icon " @click="$props.print" >
                <span class="svg-icon ">
                          <inline-svg
                              src="/assets/icons/duotone/Devices/Printer.svg"
                          />
                </span>
            </span>
        </a-tooltip>
        <a-tooltip  v-if="isExcelUpload">
            <template #title>
                {{lang.excelUpload}}
            </template>
            <a v-if="$props.excelUploadCustomUrl" :href="$props.excelUploadCustomUrl" class="btnLine">
                <i class="ti-layers"></i>
            </a>
            <a v-else @click="$props.excelUploadMethod" class="btnLine">
                <i class="ti-layers"></i>
            </a>
        </a-tooltip>

        <a-tooltip v-if="isExcel">
            <template #title>
                {{lang.download_file}}
            </template>
            <a class="btnLine" href="javascript:void(0)" v-if="$props.exportLoading">
                <a-spin />
            </a>
            <span class="btn btn-icon " @click="$props.exportExcel" v-else>
            <span class="svg-icon ">
                      <inline-svg
                          src="/assets/icons/duotone/Files/Download.svg"
                      />
            </span>
          </span>
        </a-tooltip>

        <form v-if="isSearch" @submit="searchGrid">
            <div class="right-search">
                <input v-model="searchModel" :placeholder="$t('dataForm.search')"
                       class="right-search-input"/>
                <i class="ti-search"></i>
            </div>
        </form>
    </div>
</template>

<script>


export default {
    props: ["refresh", "exportExcel", "print",
        "search", "save", "options", "isExcel",
        "isExcelUpload","excelUploadCustomUrl", "excelUploadMethod",
        "isPrint", "isRefresh",
        "isSave", "isSearch", "exportLoading"],
    data() {
        return {
            searchModel: null
        }
    },
    computed: {
        lang() {
            const labels = [
                '_save', 're_call',
                '_print',
                'download_file','excelUpload'
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('crud.' + labels[i]);
                return obj;
            }, {});
        },
    },
    methods: {
        searchGrid(e) {
            e.preventDefault();
            this.$props.search(this.searchModel);
        },
    }
};
</script>
