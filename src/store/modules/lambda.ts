import app from '~/store/modules/app'
import { LAMBDA_CONFIG, KRUDS, MENU, PERMISSIONS, MENU_LIST, SAVED_TABS } from '~/store/mutation-types'

export const lambda ={
  state: {
    config: {
      "schema_load_mode": "auto",
      "project_key": "",
      "theme": "aside",
      "domain": "http://localhost:8080",
      "title": "Lambda Platform",
      "subTitle": "Програм хамгамж бүтээх ажлыг автоматжуулагч",
      "copyright": "Lambda Platform© 2022",
      "favicon": "/assets/lambda/images/favicon.png",
      "bg": "/assets/lambda/images/bg.png",
      "logo": "/assets/lambda/images/logo.svg",
      "logo_dark": "/assets/lambda/images/logo_dark.svg",
      "logo_squire": "/assets/lambda/images/logo.svg",
      "logo_squire_dark": "/assets/lambda/images/logo_dark.svg",
      "logoText": "",
      "super_url": "/lambda/puzzle",
      "app_url": "/admin",
      "microservice_dev": false,
      "has_language": false,
      "withCrudLog": false,
      "krud_public": false,
      "languages": [
        {
          "label": "Moнгол",
          "code": "mn_MN"
        },
        {
          "label": "English",
          "code": "en_US"
        },
        {
          "label": "Korea",
          "code": "ko_KR"
        }
      ],
      "default_language": "mn_MN",
      "role-redirects": [
        {
          "role_id": 1,
          "url": "/lambda/puzzle"
        }
      ],
      "user_data_fields": [
        "id"
      ],
      "data_form_custom_elements": [],
      "data_grid_custom_elements": [],
      "password_reset_time_out": 0,
      "static_words": {
        "mn_MN": {
          "title": "Lambda Platform",
          "subtitle": "Програм хамгамж бүтээх ажлыг автоматжуулагч",
          "login": "Нэвтрэх",
          "forgot": "Нууц үгээ мартсан?",
          "remember": "Энэ компьютерт сануулах",
          "loginTitle": "СИСТЕМД НЭВТРЭХ",
          "username": "Нэвтрэх нэр",
          "email": "И-мэйл",
          "password": "Нууц үг",
          "loginSuccess": "Амжилттай нэвтэрлээ. Түр хүлээнэ үү!",
          "loginError": "Уучлаарай, нэвтрэх үед алдаа гарлаа!!",
          "emailRequired": "И-мэйл хаяг аа оруулна уу",
          "forgotDescription": "И-мэйл хаягаа оруулаад нууц үг шинэчлэнэ үү",
          "sendPasswordResetCode": "Нууц үг солих код и-мэйлээр авах",
          "passwordConfirm": "Нууц үг баталгаажуулах",
          "userNotFound": "Хэрэгэлч олдсонгүй !!!",
          "codeSentError": "Нууц үг шинэчлэх код илгээх үед алдаа гарлаа!",
          "passwordReset": "НУУЦ ҮГ ШИНЭЧЛЭХ",
          "passwordResetCode": "Нууц үгээ сэргээх код",
          "passwordResetCodeSent": "Нууц үг шинэчлэх код амжилттай илгээгдлээ !",
          "passwordResetCodeRequired": "Нууц үг солих код  оруулаагүй байна !!!",
          "passwordResetSuccess": "Нууц үг амжилттай шинэчлэгдлээ !",
          "passwordConfirmError": "Нууц үг баталгаажуулалт таарсангүй !!!",
          "passwordResetCodeIncorrect": "Нууц үг сэргээх код буруу байна !!!",
          "passwordResetCodeTimeout": "Нууц үг сэргээх кодны хугацаа дууссан !!!",
          "noReply": "Энэхүү и-мэйл нь автоматаар илгээгдсэн учир хариу бичих шаардлагагүй."
        }
      },
      "notify": {
        "firebaseConfig": {
          "apiKey": "",
          "publicKey": "",
          "authDomain": "",
          "databaseURL": "",
          "projectId": "",
          "storageBucket": "",
          "messagingSenderId": "",
          "appId": "",
          "measurementId": ""
        },
        "serverKey": "",
        "sound": "/assets/lambda/notification.mp3",
        "icon": ""
      }
    },
    kruds:[],
    menu:[],
    menu_list:[],
    permissions:{
      default_menu: "",
      extra: {approve: false, chart: false, datasource: false, excelupload: false, hascustomcreatebtn: false,},
      menu_id: 3,
      permissions:{}
    },
    saved_tabs:[],
  },
  mutations: {
    [LAMBDA_CONFIG]: (state, config) => {
      state.config = config
    },
    [KRUDS]: (state, kruds) => {
      state.kruds = kruds
    },
    [MENU]: (state, menu) => {
      state.menu = menu
    },
    [PERMISSIONS]: (state, permissions) => {
      state.permissions = permissions
    },
    [MENU_LIST]: (state, menu_list) => {
      state.menu_list = menu_list
    },
    [SAVED_TABS]: (state, saved_tabs) => {
      state.saved_tabs = saved_tabs
    },
  }
}
export default lambda
