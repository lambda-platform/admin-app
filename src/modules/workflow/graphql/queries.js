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
      user_id
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
      user_id
    }
  }
}`
