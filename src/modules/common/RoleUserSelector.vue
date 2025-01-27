<template>
  <div class="mb-2">
    <label>
      Хандах эрх<br>
      <a-select
        v-model:value="role_id_v"
        show-search
        style="width: 100%"
        placeholder="Хандах эрх"
        optionFilterProp="searchValue"
        optionLabelProp="label"
        :options="filteredRoles"
        :show-search="true"
        @change="selectRole"
        :disabled="disabled"
        allow-clear
      >
      </a-select>
    </label>
  </div>
  <div v-if="!hideUserSelect">
    <label>
      Хэрэглэгч <br>
      <a-select
        v-model:value="user_id_v"
        show-search
        style="width: 100%"
        placeholder="Ажилтан сонгох"
        optionFilterProp="searchValue"
        optionLabelProp="label"
        :options="filteredUsers"
        :show-search="true"
        :disabled="disabled"
        allow-clear
      >
        <template #option="{ value: val, label, avatar}">
          <div class="flex items-center space-x-3 font-semibold">
            <a-avatar style="width: 32px; height: 32px; flex: none;">
              <template #icon>
                <div class="flex items-center justify-center h-full w-full">
                  <img alt="avatar" class="h-full w-full object-cover bg-no-repeat bg-center"
                       :src="avatar !== null && avatar !== '' ? $base_url+avatar : $base_url+'/assets/icons/defaultAvatar.svg'">
                </div>
              </template>
            </a-avatar>
            <span>{{ label }}</span>
          </div>
        </template>
      </a-select>
    </label>
  </div>
</template>

<script setup>
import {ref, onMounted, defineEmits, defineProps} from 'vue';
import {getRoles, getUsersByRole} from "~/graphql/fetch.js"

const emit = defineEmits(['update:role_id', 'update:user_id', 'change']);

const props = defineProps({
  role_id: Number,
  user_id: String,
  hideUserSelect: Boolean,
  disabled: Boolean,
});

const role_id_v = ref(null);
const user_id_v = ref('');
const roles = ref([]);
const users = ref([]);

onMounted(() => {
  const name = '';
  getRoles().then(({view_roles}) => {
    roles.value = view_roles;
    if (props.role_id) {
      role_id_v.value = props.role_id;
      selectRole();
    }
    if (props.user_id) {
      user_id_v.value = props.user_id;
    }
  });
});

async function selectRole() {
  user_id_v.value = '';
  if (role_id_v.value) {
    getUsersByRole(role_id_v.value.toString()).then(({view_users_workflow}) => {
      users.value = view_users_workflow;
    })
  } else {
    users.value = [];
  }
}

const filteredRoles = computed(() => {
  return roles.value.map(role => ({
    value: role.id,
    label: role.display_name,
    searchValue: `${role.display_name} ${role.name}`,
  }));
});

const filteredUsers = computed(() => {
  return users.value.map(user => ({
    value: user.id,
    label: user.first_name,
    searchValue: `${user.first_name} ${user.last_name}`,
    avatar: user.avatar,
  }));
});

watch(() => props.role_id, (newVal) => {
  role_id_v.value = newVal;
});

watch(() => props.user_id, (newVal) => {
  user_id_v.value = newVal;
});

watch(role_id_v, (newValue, oldValue) => {
  emit('update:role_id', newValue);
  emit('change', {role_id: newValue, user_id: user_id_v.value});
});

watch(user_id_v, (newValue, oldValue) => {
  emit('update:user_id', newValue);
  emit('change', {role_id: role_id_v.value, user_id: newValue});
});
</script>

