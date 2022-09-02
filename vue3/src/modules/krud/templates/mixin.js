

export default {
    props: ["title", "icon", "main_tab_title", "grid", "form","projects_id", "hideHeader", "hasSelection", "actions", "dbClickAction", "onRowSelect", "rowCurrentChange", "permissions", "user_condition", "custom_condition", "view_url", "mode", "onPropertySuccess", "onPropertyError", "page_id", "withoutHeader", "withCrudLog", "base_url", "parent"],
    components: {

    },
    data() {
        return {
            closeByBtn: true,
            gridSrc: "",
            formSrc: "",
            editMode: false,
            searchModel: '',
            form_width: 600,
            exportLoading: false,
            isPrint: false,
            isExcel: false,
            isRefresh: false,
            isSave: false,
            rowId: null,
            visibleDataForm:false,
            isExcelUpload: false,
            excelUploadCustomUrl: null,
        };
    },
    computed: {
        hasVNavSlot() {
            return !!this.$slots['v-nav']
        },
        hasNavSlot() {
            return !!this.$slots['nav']
        },
        hasLeftSlot() {
            return !!this.$slots['left']
        },
        url(){
            // if(this.projects_id !== null && this.projects_id != "" && this.projects_id != undefined){
            //     if(window.init.microserviceSettings){
            //         if(window.init.microserviceSettings.length >= 1){
            //             let si = window.init.microserviceSettings.findIndex(set=>set.project_id == this.projects_id);
            //             if(si >= 0){
            //
            //                 if(window.lambda.microservice_dev){
            //                     return  window.init.microserviceSettings[si].dev_url;
            //                 } else {
            //                     return  window.init.microserviceSettings[si].production_url;
            //                 }
            //
            //             }
            //         }
            //     }
            // }
            return this.base_url ? this.base_url : "";
        },
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
    },
    methods: {
        view(id) {
            // window.open(this.view_url + id, '_blank');
            this.rowId = id;
            this.editMode = true;
            this.$refs.form.viewMode = true;
            this.$refs.form.editModel(id);
            //From template
            if (this.templateEdit) {
                this.templateEdit();
            }
        },

        edit(id) {
            // console.log(id);
            this.rowId = id;
            this.editMode = true;
            this.$refs.form.editModel(id);
            //From template
            if (this.templateEdit) {
                this.templateEdit();
            }
        },

        clone(id) {
            this.$refs.form.cloneModel(id);
            if (this.templateEdit) {
                this.templateEdit();
            }
        },

        quickEdit(id) {
            console.log(id);
        },

        refresh() {
            this.searchModel = null;
            this.$refs.grid.refresh();
        },

        search(q) {
            this.$refs.grid.searchData(q, 1);
        },

        stopLoading(isExported){
            this.exportLoading = false;
            if(!isExported){
                this.$Message.error('Татах үед алдаа гарлаа!');
            }
        },
        exportExcel() {
            this.exportLoading = true;
            this.$refs.grid.exportExcel(this.stopLoading);
        },
        print() {
            this.$refs.grid.print();
        },
        excelUploadMethod(){
            this.$refs.grid.importExcel();
        },
        save() {
            this.$refs.grid.saveGridData();
        },
        onReady(formOption) {

            if((window.innerWidth - 100) >= parseInt(formOption.width)){
                this.form_width = formOption.width
            } else {
                this.form_width = window.innerWidth;
            }

        },
        //Form functions
        onSuccess(val) {

            if(this.$refs.grid){
                if (typeof this.mode !== 'undefined' && this.mode && this.mode === 'refresh') {
                    this.$refs.grid.refresh();
                } else {
                    if (this.editMode) {
                        this.$refs.grid.update(val);
                    } else {
                        this.$refs.grid.append(val);
                    }
                }
            }

            this.editMode = false;

            //From template
            if (this.templateOnSuccess) {
                this.templateOnSuccess(val);
            }

            //From property
            if (this.onPropertySuccess) {
                this.onPropertySuccess();
            }
        },

        onError() {
            //From template
            if (this.templateOnError) {
                this.templateOnError();
            }

            //From property
            if (this.onPropertyError) {
                this.onPropertyError();
            }
        }
    },
}
