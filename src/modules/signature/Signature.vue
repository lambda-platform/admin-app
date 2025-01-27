<template>
  <div class="e-signature">
    <!--              <a-alert-->
    <!--                :message="`${signature.signAction} төлөвт шилжихийн тулд та гарын үсэг шаардлагатай`"-->
    <!--                type="warning"-->
    <!--                size="small"-->
    <!--                show-icon-->
    <!--              />-->


    <div class="p-2   mb-0">
      <div class="flex items-center ">

        Цахим гарын үсэг

      </div>

      <div class="border rounded p-3 mt-2" style="border-color: #0b4da3">
        <table style="width:100%; margin: 0; padding: 0; color: #0b4da3">
          <tbody>
            <tr>
              <td style="text-align: left; font-family: Arial; font-size: 12px; vertical-align: middle">
                {{ signature.signAction }}: {{ signature.job_name }} <br>{{ signature.struct }}
              </td>
              <td
                style="text-align: center; font-family: Arial; font-size: 12px; padding-left: 10px; vertical-align: middle">
                <span v-if="signature.type === 'text'">{{ signature.signature }}<br/></span>
                <img v-else-if="signature.signature !== null" class="h-10 mx-auto" :src="`${signature.type === 'draw' ? '' : ''}${signature.signature}`" alt="">


                <span v-if="signature.type === 'text'">Цахимаар баталгаажуулсан огноо цаг: <br>{{ $dateTime(new Date()) }}</span>
                <span v-else> Цахимаар баталгаажуулсан: {{signature.lastname ? signature.lastname.charAt(0).toUpperCase() : ''}}.{{signature.firstname}} <br/> Огноо цаг: {{ $dateTime(new Date()) }}</span>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class=" px-2 flex justify-between">
      <a-button @click="showSettings">
        Тохиргоо
      </a-button>

      <a-popover :open="openOTPVerify" title="Баталгаажуулах" trigger="click">
        <template #content>
          <button @click="openOTPVerify = false" class="absolute right-3 top-3"><span role="img" aria-label="close" class="anticon anticon-close"><svg focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" fill-rule="evenodd" viewBox="64 64 896 896"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg><!----></span></button>


          <a-radio-group v-model:value="OTPType" class="mx-auto">
            <a-radio value="sms">Утасаар</a-radio>
            <a-radio value="email">Э-мэйлээр</a-radio>
          </a-radio-group>
          <div class="my-2">
            {{OTPType === "sms" ? `Утас: ${phoneNumber}` : `Э-мэйл: ${email}`}}
          </div>
          <div class="flex justify-center e-signature-otp">
            <v-otp-input
              v-if="OTPSent"
              ref="otpInput"
              v-model:value="OTP"
              input-classes="otp-input"
              separator=" "
              :num-inputs="4"
              :should-auto-focus="true"
              input-type="letter-numeric"
              :conditionalClass="['one', 'two', 'three', 'four']"
              :placeholder="[' ', ' ', ' ', ' ']"


            />
          </div>
          <div v-if="OTPSent" class="flex align-center  pt-2">
            <inline-svg class="w-6 h-6 svg-icon" src="/assets/icons/duotone/Home/Timer.svg"></inline-svg> <h2  class="ml-2">{{ formattedTime }}</h2>
          </div>
         <div class="flex items">

           <a-button @click="sendOTP"  :loading="OTPSending" v-if="!OTPSent" class="flex mx-auto">
             <template #icon>
               <inline-svg class="w-6 h-6 svg-icon" src="/assets/icons/duotone/Communication/Sending mail.svg" style="margin-top: 0"/>
             </template>
             <span class="ml-2">Код илгээх</span>

           </a-button>
         </div>

          <div class="flex justify-between p-2">
            <a-button  @click="sendOTP"  :loading="OTPSending" v-if="OTPSent" class="flex ">
              <template #icon>
                <inline-svg class="w-6 h-6 svg-icon" src="/assets/icons/duotone/Communication/Sending mail.svg" style="margin-top: 0"/>
              </template>
              <span class="ml-2">Дахин илгээх</span>

            </a-button>
            <a-button @click="verifyOTP"   :loading="OTPSending" v-if="OTPSent" class="flex ml-2">
              <template #icon>
                <inline-svg class="w-6 h-6 svg-icon" src="/assets/dms/signature/signature.svg" style="margin-top: 0"/>
              </template>
              <span class="ml-2"> Батлах</span>
            </a-button>
          </div>
        </template>
        <a-button @click="openOTPVerify = true" class="sign-btn">
          <div class="flex">
            <inline-svg class="h-4 mr-2 mt-1 w-auto" src="/assets/dms/signature/signature.svg"/>
            <div>
              Цахим гарын үсэг зурах
            </div>
          </div>
        </a-button>
      </a-popover>

    </div>
    <a-modal v-model:open="openSettings" title="Цахим гарын үсэг тохиргоо" :footer="null"  style="top: 20px" >
      <div>
        <div class="flex mb-2">
          <label class="flex items-center space-x-3 cursor-pointer" v-for="signType in signTypes"
                 @click="selectType(signType.value)" :key="signType.index">
            <input type="radio" :value="signType.value" v-model="signature.type" class="hidden"/>
            <div class="flex items-center space-x-2"
                 :class="{'active-signature-type': signature.type === signType.value, '': signature.type !== signType.value}">
              <div class="w-5 h-5">
                <inline-svg :src="signType.image" alt="" class="w-full h-full object-cover"/>
              </div>
              <span>{{ signType.label }}</span>
            </div>
          </label>
        </div>
        <div style="height: 200px; width:100%; text-align: center" class="border rounded">
          <div v-if="signature.type === 'text'">
            <h1 style="font-family: Arial; font-size: 32px; vertical-align: middle; margin-top: 70px">
              {{ signature.signature }}</h1>
          </div>
          <div style="height: 100%; width:100%" v-if="signature.type === 'draw'">
            <DrawPad ref="signaturePad" v-if="signature.signature === null"/>
            <img :src="signature.signature" v-else alt="">

          </div>
          <div style="height: 100%; width:100%;" v-if="signature.type === 'imageFile'">
            <ImageUpload @success="fileUploaded" @remove="fileRemove" :imageFile="imageFile"/>

          </div>

        </div>

        <div v-if="signature.type === 'draw'">Хулганаар зурна уу</div>

        <div class="align-right mt-3">
          <a-button @click="signature.signature = null" class="mr-3" v-if="signature.type === 'draw' && signature.signature !== null">Шинээр зурах</a-button>
          <a-button @click="clearDrawsignature" class="mr-3" v-if="signature.type === 'draw' && signature.signature === null">Цэвэрлэх</a-button>
          <a-button type="primary" @click="saveDrawsignature">Хадгалах</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import { notification } from 'ant-design-vue';
import "./signature.scss"
import DrawPad from "~/modules/signature/DrawPad.vue";
import ImageUpload from "~/modules/signature/ImageUpload.vue";
import  axios from "~/plugins/core/axios";
import VOtpInput from "vue3-otp-input";
const signaturePad = ref(false)
import {defineEmits, defineProps, onMounted, ref} from "vue";
const time = ref(10 * 60); // Time in seconds (10 minutes
const emit = defineEmits(['settingsOpened','signed']);

const props = defineProps({
  action: String,
  user_id: Number,
  role_id: Number,
})
import {getUser} from "~/modules/workflow/graphql/fetch";
import ls from "~/utils/Storage";
import {USER_INFO} from "~/store/mutation-types";

let user = ls.get(USER_INFO);
const imageFile = ref(null)
const openSettings = ref(null)
const OTPType = ref("sms")
const phoneNumber = ref(null)
const email = ref(null)
const openOTPVerify = ref(false)
const OTPSending = ref(false)
const OTPSent = ref(false)
const OTP = ref("")
const signature = ref({
  type: "text",
  firstname: null,
  signAction: props.action ?? null,
  lastname: null,
  struct: null,
  job_name: null,
  signature: null,
  signed: false,
  user_id: props.user_id ?? user.id,
  role_id: props.role_id ?? user.role_id
});

const signTypes = ref([
  {label: 'Тэкст', value: 'text', open: false, image: '/assets/dms/signature/textsignature.svg'},
  {label: 'Зурах', value: 'draw', open: false, image: '/assets/dms/signature/drawsignature.svg'},
  {label: 'Зурган файл', value: 'imageFile', open: false, image: '/assets/dms/signature/imagesignature.svg'}
]);

function selectType(signType) {
  if (signType === 'text') {
    signature.value.signature = `${signature.value.lastname.charAt(0).toUpperCase()}.${signature.value.firstname}`
  } else if (signType === 'draw') {

  }
}


function getCurrentEmp() {

  if (user.id) {

    getUser(user.id).then(({view_users}) => {
      if (view_users && view_users.length) {
        signature.value.struct = view_users[0].display_name;
        signature.value.job_name = view_users[0].display_name;
        signature.value.firstname = view_users[0].first_name;
        signature.value.lastname = view_users[0].last_name;

        phoneNumber.value = vw_userstruct[0].phone;
        email.value = view_users[0].email;

        selectType("text")
      }
    })
    getsignature();
  }


}

function setSignAction(action) {
  signature.value.signed = false;

  signature.value.signAction = action;
}

async function saveDrawsignature() {
  if (signature.value.type === 'draw') {
    if (signaturePad.value) {
      signature.value.signature = signaturePad.value.save();
    }
  }

  try {
    await axios.post('/signature/save', {
      emp_id:user.id,
      signature_TYPE:signature.value.type,
      signature:signature.value.signature,
    });

    openSettings.value = false;

  } catch (error) {
    console.error(error);

  }
}
async function getsignature() {
  try {
    const response = await axios.get(`/signature/get/${user.id}`);
    if(response.data.ID){
      signature.value.type = response.data.signature_TYPE;
      signature.value.signature = response.data.signature;
    }
    // Handle response
  } catch (error) {
    console.error(error);
    // Handle error
    this.signatureData = null;
  }
}
function clearDrawsignature() {

  if (signaturePad.value) {
    signaturePad.value.clear();
    signature.value.signature = null;
  }

}


function fileUploaded(path) {
  imageFile.value = path;
  signature.value.signature = path;


}

function fileRemove() {
  imageFile.value = null;
  signature.value.signature = null;
  console.log(signature.value.signature)

}

function showSettings() {
  emit('settingsOpened');
  openSettings.value = true;
}

async function sendOTP(){
  OTPSending.value = true;
  const data = {
    user_id:signature.value.user_id,
    type:OTPType.value
  }

  try {
    await axios.post('/signature/send-otp', data);

    OTPSent.value = true;
    OTPSending.value = false;

    notification["success"]({
      message: 'Амжилттай',
      description:
        'Батлах код илгээгдсэн',
    });
    startTimer();

  } catch (error) {
    console.error(error);
    OTPSending.value = false;
    notification["error"]({
      message: 'Алдаа',
      description:
        'Илгээх үед алдаа гарлаа',
    });
  }
}
async function verifyOTP(){

  OTPSending.value = true;
  try {
   await axios.post('/signature/verify-otp', { user_id: signature.value.user_id, code: OTP.value });

   signature.value.signed = true;
    OTPSending.value = false;


    notification["success"]({
      message: 'Амжилттай',
      description:
        'Гарын үсэг амжилттай баталгаажлаа',
    });


    emit("signed", signature.value)
  } catch (error) {
    console.error(error);
    signature.value.signed = false;
    OTPSending.value = false;
    notification["error"]({
      message: 'Алдаа',
      description:
        'Батлах код буруу байна',
    });
  }
}

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60);
  const seconds = time.value % 60;
  return `${minutes} минут ${seconds < 10 ? '0' : ''}${seconds} секунд`;
});

const startTimer = () => {
  const interval = setInterval(() => {
    if (time.value > 0) {
      time.value--;
    } else {
      OTPSent.value =false;
      clearInterval(interval);
    }
  }, 1000);
};
function handleOTP(){
  verifyOTP();
}

onMounted(() => {
  getCurrentEmp();
});
</script>
