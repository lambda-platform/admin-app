import {ORGANIZATIONS, ORGANIZATION, USER_EXTRA_ROLES, USER_EXTRA_ROLE, ORG_TYPES} from '~/store/organization-types'
import ls from "~/utils/Storage";

export const organization ={
  state: {
    organizations: ls.get(ORGANIZATIONS) ?? [],
    organization: ls.get(ORGANIZATION) ?? {
      org_id:null,
      organization:"",
      org_avatar:"",
    },
    userExtraRoles: ls.get(USER_EXTRA_ROLES) ?? [],
    userExtraRole: ls.get(USER_EXTRA_ROLE) ?? {
      id:""
    },
    orgTypes: ls.get(ORG_TYPES) ?? []
  },
  mutations: {
    [ORG_TYPES]: (state, orgTypes) => {
      state.orgTypes = orgTypes;
      ls.set(ORG_TYPES, orgTypes)
    },
    [ORGANIZATIONS]: (state, organizations) => {
      state.organizations = organizations;
      ls.set(ORGANIZATIONS, organizations)
    },
    [ORGANIZATION]: (state, organization) => {
      state.organization = organization
      ls.set(ORGANIZATION, organization)
    },
    [USER_EXTRA_ROLES]: (state, userExtraRoles) => {
      state.userExtraRoles = userExtraRoles
      ls.set(USER_EXTRA_ROLES, userExtraRoles)
    },
    [USER_EXTRA_ROLE]: (state, userExtraRole) => {
      state.userExtraRole = userExtraRole
      ls.set(USER_EXTRA_ROLE, userExtraRole)
    },
  }
}
export default organization
