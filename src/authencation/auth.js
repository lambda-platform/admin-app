import {getLambdaConfig} from "~/service/service";
import ls from "~/utils/Storage";
import {

  KRUDS,
  LAMBDA_CONFIG,
  MENU, MENU_LIST,
  MICROSERVICE_SETTINGS,
  PERMISSIONS,
  USER_INFO
} from "~/store/mutation-types";
import {setupI18n} from "@lambda-platform/lambda-vue/src/locale";
import {
  EMPLOYEE_STANDARD_PERMISSIONS, ORG_TYPES,
  ORGANIZATION,
  ORGANIZATION_MAX_PERMISSIONS, ORGANIZATIONS,
  USER_EXTRA_ROLE, USER_EXTRA_ROLES
} from "~/store/org-types";
import axios from "axios";
import {setToken} from "~/plugins/core/axios";
import {createList} from "~/utils/menu";
import {clearUserInfo} from "~/utils/util";

export const setUserPermissionsWithOrg = async (store, firebaseConfig, orgID, extraPermissionID) => {

  try {

      let getPermissionPath = `/org/user-permissions${orgID !== null && orgID !== "" ? '?org_id=' + orgID : ''}`;

      if (extraPermissionID !== null && extraPermissionID !== '') {
        getPermissionPath = `/org/user-permissions?extra_role=${extraPermissionID}`;
      }


      const { data } = await axios.get(getPermissionPath);
      if (data.status) {


        const userInfo = {
          ...data.user,
          baiguullaga_id: data.organization ? data.organization.org_id !== 0 ? data.organization.org_id : null : null,
          org_id: data.organization ? data.organization.org_id !== 0 ? data.organization.org_id : null : null,
          struct_id: data.permission.struct_id ? data.permission.struct_id : null,
          emp_id: data.permission.emp_id ? data.permission.emp_id : null,
        };
        store.commit(USER_INFO, userInfo);

        ls.set(PERMISSIONS, data.permission.permissions);
        ls.set(MENU, data.permission.menu);
        ls.set(KRUDS, data.permission.kruds);
        ls.set(ORGANIZATION_MAX_PERMISSIONS, data.permission.organizationMaxPermissions);
        ls.set(EMPLOYEE_STANDARD_PERMISSIONS, data.permission.employeeStandardPermissions);
        store.commit(ORGANIZATIONS, data.organizations);
        store.commit(USER_EXTRA_ROLES, data.userExtraRoles);
        store.commit(ORGANIZATION, data.organization);
        store.commit(ORG_TYPES, data.orgTypes);

        if (data.permission.microserviceSettings) {
          ls.set(MICROSERVICE_SETTINGS, data.permission.microserviceSettings);
        }

        let menuList = createList(data.permission.menu ?? [], null, data.permission.kruds ?? []);
        ls.set(MENU_LIST, menuList);

        window.init = {
          user: userInfo,
          firebase_config: firebaseConfig,
          microserviceSettings: data.permission.microserviceSettings ? data.permission.microserviceSettings : [],
        };

      } else {
        clearUserInfo();
      }

  } catch(error) {

    console.error(error);
    clearUserInfo();
  }
};

export const setUserPermissions = async (store, firebaseConfig, userInfo) => {

  try {

      let getPermissionPath = `/get-permissions`;

      const { data } = await axios.get(getPermissionPath);
      if (data.status) {

        store.commit(USER_INFO, userInfo)

        ls.set(PERMISSIONS, data.permission.permissions)
        ls.set(MENU, data.permission.menu)
        ls.set(KRUDS, data.permission.kruds)
        let menuList = createList(data.permission.menu, null, data.permission.kruds)
        ls.set(MENU_LIST, menuList)

        window.init = {
          user: userInfo,
          firebase_config: firebaseConfig,
          microserviceSettings: data.permission.microserviceSettings ? data.permission.microserviceSettings : [],
        };

      } else {
        clearUserInfo();
      }

  } catch(error) {

    console.error(error);
    clearUserInfo();
  }
};
