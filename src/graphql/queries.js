import gql from 'graphql-tag';

export const IMAGE_URL = 'https://khankhulgun.mn/'

export const GET_ROLES = gql`
  {
    view_roles {
      id
      display_name
    }
  }
`;

export const GET_USERS_BY_ROLE = gql`
query GetUsersByRole($role_id: String!){
  view_users(filters:[{column:"role", condition:equals, value:$role_id}]){
    id
    last_name
    first_name
    avatar
  }
}`;


export const GET_ANNOUNCEMENT = gql`
query paginate($sorts: [sort], $filters: [filter], $page: Int!, $size: Int!) {
  paginate(
    sorts: $sorts,
    filters: $filters,
    page: $page
    size: $size
  ) {
    page
    total
    last_page
    view_announcement {
      id
      begin_date
      end_date
      otor_region_id
      otor_year_id
      otor_year
      date
      total_capacity
      is_water_resource_exceed
      water_resource_capacity
      is_skip
      partially_skipping_area
      available_area
      name
      photo
    }
  }
}
`;


export const GET_ANNOUNCEMENT_LIMIT = gql`
query ViewAnnouncement($sorts: [sort], $limit: Int){
  view_announcement(
    sorts: $sorts, limit: $limit
  ){
    id
    begin_date
    end_date
    otor_year_id
    otor_year
    date
    total_capacity
    is_water_resource_exceed
    water_resource_capacity
    is_skip
    partially_skipping_area
    available_area
    otor_year
    name
    photo
  }
}
`;


export const LUT_OTOR_YEAR = gql`
query lutOtorYear{
  lut_otor_year{
    id
    otor_year
  }
}
`;
export const LUT_OTOR_REGION = gql`
query lutOtorRegion{
  otor_region{
    id
    name
  }
}
`;

