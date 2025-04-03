import gql from 'graphql-tag';



export const GET_USER = gql`
query GET_USER($filters: [filter]){
  view_users(filters: $filters){
    id
    last_name
    first_name
    display_name
    phone
    email
    avatar
  }
}`


export const GET_WORK_FLOW_BY_CATEGORY = gql`
query GET_WORK_FLOW_BY_CATEGORY($filters: [filter], $limit: Int, $sorts: [sort]) {
  view_workflow(filters: $filters, limit: $limit, sorts: $sorts) {
    id
    flow_name
    flow_data
    description
    created_at
    category_id
    workflow_voting_people {
      subject_type,
      user_id,
      role_id,
      org_role_id,
      org_id,
      struct_id,
      job_id,
      emp_id
    }
  }
}`


export const GET_WORK_FLOW_BY_ID = gql`
query GET_WORK_FLOW_BY_ID($filters: [filter]) {
  view_workflow(filters: $filters) {
    id
    flow_name
    flow_data
    description
    created_at
    category_id
    workflow_voting_people {
      subject_type,
      user_id,
      role_id,
      org_role_id,
      org_id,
      struct_id,
      job_id,
      emp_id
    }
  }
}`

export const GET_EMPLOYERS_BY_STRUCT = gql`
query EmploySearch($struct_id: String!){
  view_employee(filters:[{column:"struct_id", condition:equals, value:$struct_id}]){
    id
    first_name
    last_name

  }
}
  `
export const GET_JOBS_BY_STRUCT = gql`
query JobSearch($struct_id: String!){
  view_job(filters:[{column:"struct_id", condition:equals, value:$struct_id}]){
    id
    job
  }
}
  `
export const GET_EMPLOYERS_BY_JOB = gql`
query EmploySearch($job_id: String!){
  view_employee(filters:[{column:"job_id", condition:equals, value:$job_id}]){
    id
    first_name
    last_name

  }
}
  `
export const GET_EMPLOYEE = gql`
query Vw_userstruct($filters: [filter]) {
  vw_userstruct(filters: $filters) {
    LNAME
    JOB_LEVEL
    JOB_NAME
    STRUCT_NAME
    FNAME
    EMP_ID
    PHONE_MOBILE
    MIAT_EMAIL
    EMP_EMAIL
  }
}`


export const GET_STRUCTURE= gql`
query StructSearch($name: String!, $org_id: String!) {
  view_struct(
    sorts: [{column: "struct", order: asc}]
    filters: [{column: "struct", condition: contains, value: $name}, {column: "org_id", condition: equals, value: $org_id}]
  ) {
    id
    org_id
    struct
    parent_struct_id
  }
}`;


export const GET_ORGS_ROLE= gql`
query StructSearch($roleID: String!) {
  view_org(
     filters: [{column: "role_id", condition: equals, value: $roleID}]
    sorts:[{column:"baiguullaga_ner", order:asc}]){
    id
    baiguullaga_ner
    org_cover
    org_avartar
    utas_one
    baiguullaga_register
  }
}`;
