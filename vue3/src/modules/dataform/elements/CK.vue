<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <ckeditor ref="ckeditor" :editor="editor" v-model="model.form[model.component]"
                  :config="editorConfig" :key="meta.editorType"
                  :placeholder="placeholder"
                  :disabled="disabled"
                  @ready="onReady" @blur="onBlur($event)" @focus="onFocus($event)"></ckeditor>
    </lambda-form-item>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import mixin from "./_mixin"
export default {
    mixins:[mixin],
    components: {
        ckeditor: CKEditor.component
    },
    data() {
        return {
            editor: Editor,
            editorConfig: {
                toolbar:{items: ['heading', '|',
                    'bold', 'italic', '|', 'link', '|',
                    'blockQuote', '|',
                    'insertTable', '|',
                    "indent", "outdent", '|',
                    'mediaEmbed'],  shouldNotGroupWhenFull: true
                },
                placeholder:'',
            },
        };
    },
    created() {
        if (this.meta.editorType == "article") {
            this.editorConfig = {
                toolbar: {
                    items: ['undo', 'redo', '|',
                        'selectAll', '|',
                        'bold', 'italic', '|',
                        'link', '|',
                        'bulletedList', 'numberedList', '|',
                        'heading', '|',
                        'blockQuote', '|',
                        'insertTable', '|',
                        "indent", "outdent", '|',
                        'mediaEmbed', 'imageUpload', 'ckfinder', '|'],
                    shouldNotGroupWhenFull: true
                },
                ckfinder: {
                    uploadUrl: '/vendor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json'
                }
            }
        } else if (this.meta.editorType == "full") {
            this.editorConfig = {
                toolbar: {
                    //items: ['alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify', 'alignment', 'undo', 'redo', 'blockQuote', 'bold', 'link', 'ckfinder', 'code', 'codeBlock', 'selectAll', 'findAndReplace', 'fontBackgroundColor', 'fontColor', 'fontFamily', 'fontSize', 'heading', 'highlight:yellowMarker', 'highlight:greenMarker', 'highlight:pinkMarker', 'highlight:blueMarker', 'highlight:redPen', 'highlight:greenPen', 'removeHighlight', 'highlight', 'horizontalLine', 'htmlEmbed', 'imageTextAlternative', 'toggleImageCaption', 'uploadImage', 'imageUpload', 'insertImage', 'imageInsert', 'resizeImage:original','resizeImage', 'imageResize', 'imageStyle:inline', 'imageStyle:alignLeft', 'imageStyle:alignRight', 'imageStyle:alignCenter', 'imageStyle:alignBlockLeft', 'imageStyle:alignBlockRight', 'imageStyle:block', 'imageStyle:side', 'imageStyle:wrapText', 'imageStyle:breakText', 'indent', 'outdent', 'italic', 'linkImage', 'numberedList', 'bulletedList', 'todoList', 'underline','mediaEmbed', 'pageBreak', 'removeFormat', 'sourceEditing', 'specialCharacters', 'restrictedEditingException', 'strikethrough', 'subscript', 'superscript', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', 'toggleTableCaption', 'tableCellProperties', 'tableProperties', 'textPartLanguage', 'todoList', 'underline'],
                    items: [ 'undo', 'redo','|', 'selectAll', 'findAndReplace','|', 'alignment', 'bold','italic',
                        'link','|', 'linkImage','blockQuote',  'code', 'codeBlock','|',
                        'fontBackgroundColor',
                        'fontColor', 'fontFamily', 'fontSize', 'heading', '|','removeHighlight', 'highlight','|',
                        'horizontalLine', 'htmlEmbed', '|','imageTextAlternative', 'toggleImageCaption', 'uploadImage',
                        'imageInsert',  'resizeImage', 'imageStyle:inline', 'imageStyle:alignLeft', 'imageStyle:alignRight',
                        'imageStyle:alignCenter', 'imageStyle:alignBlockLeft', 'imageStyle:alignBlockRight',
                        'imageStyle:block', 'imageStyle:side', 'imageStyle:wrapText', 'imageStyle:breakText','|',
                        'indent', 'outdent','|',  'numberedList', 'bulletedList','|',  'pageBreak',
                        'removeFormat','|',  'specialCharacters', 'restrictedEditingException',
                        'strikethrough', 'subscript', 'superscript','|', 'insertTable', 'tableColumn', 'tableRow',
                        'mergeTableCells', 'toggleTableCaption', 'tableCellProperties', 'tableProperties','|',
                        'mediaEmbed', 'ckfinder','|','sourceEditing'],
                    shouldNotGroupWhenFull: true
                },
                ckfinder: {
                    uploadUrl: '/vendor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json'
                }
            }
        }

    },

    methods: {
        onBlur(editor) {
        },
        onFocus(editor) {
        },
        onReady(event) {
            if(!this.model.form[this.model.component])
            {
                this.model.form[this.model.component]='123';
            }
        }
    }
};
</script>
