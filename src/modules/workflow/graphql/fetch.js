import {client} from "~/graphql/clients.js"
import {
  GET_USER,
  GET_WORK_FLOW_BY_CATEGORY,
  GET_WORK_FLOW_BY_ID
} from "./queries";

export async function getUser(id) {
  try {
    const {data, errors} = await client.query({
      query: GET_USER,
      // fetchPolicy: "no-cache",
      variables: {
        "filters": [
          {
            "column": "id",
            "condition": "equals",
            "value": id.toString()
          }
        ]
      }
    });

    if (errors && errors.length) {
      console.error('GraphQL Errors:', errors.map(e => e.message).join(', '));
      throw new Error(`Failed to fetch POS data: ${errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch POS data:', error);
    throw error;
  }
}

export async function WorkFlowByCategory(category_id) {
  try {
    const {data, errors} = await client.query({
      query: GET_WORK_FLOW_BY_CATEGORY,
      // fetchPolicy: "no-cache",
      variables: {
        "filters": [
          {
            "column": "category_id",
            "condition": "equals",
            "value": category_id
          }
        ],
        "limit": 1,
        "sorts": [
          {
            "column": "created_at",
            "order": "desc"
          }
        ],

      }
    });

    if (errors && errors.length) {
      console.error('GraphQL Errors:', errors.map(e => e.message).join(', '));
      throw new Error(`Failed to fetch POS data: ${errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch POS data:', error);
    throw error;
  }
}

export async function WorkFlowByID(id) {
  try {
    const {data, errors} = await client.query({
      query: GET_WORK_FLOW_BY_ID,
      // fetchPolicy: "no-cache",
      variables: {
        "filters": [
          {
            "column": "id",
            "condition": "equals",
            "value": id
          }
        ],

      }
    });

    if (errors && errors.length) {
      console.error('GraphQL Errors:', errors.map(e => e.message).join(', '));
      throw new Error(`Failed to fetch POS data: ${errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch POS data:', error);
    throw error;
  }
}
