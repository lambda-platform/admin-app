import gql from 'graphql-tag';

export const IMAGE_URL = 'https://khankhulgun.mn/'


export const GET_PROVINCE= gql`
query view_aiamag{
  view_aiamag(
    sorts: [{ column: "id", order: desc }]
  ) {
     id
     aimagname
  }
}`;
