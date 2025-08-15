import {client} from "~/graphql/clients.js"
import {
  GET_USER,
  GET_WORK_FLOW_BY_CATEGORY,
  GET_WORK_FLOW_BY_ID,
  GET_JOBS_BY_STRUCT,
  GET_STRUCTURE,
  GET_EMPLOYERS_BY_STRUCT,
  GET_ORGS_ROLE,
  GET_EMPLOYERS_BY_JOB
} from "./queries";

import axios from '~/plugins/core/axios';

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

export async function getStructEmployees(struct_id) {
  try {
    const { data, errors } = await client.query({
      query: GET_EMPLOYERS_BY_STRUCT,
      // fetchPolicy: "no-cache",
      variables:{
        struct_id
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
export async function getStructJobs(struct_id) {
  try {
    const { data, errors } = await client.query({
      query: GET_JOBS_BY_STRUCT,
      // fetchPolicy: "no-cache",
      variables:{
        struct_id
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

export async function getJobEmployees(job_id) {
  try {
    const { data, errors } = await client.query({
      query: GET_EMPLOYERS_BY_JOB,
      // fetchPolicy: "no-cache",
      variables:{
        job_id
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

export async function getOrgsByRole(roleID, orgID) {
  try {
    const { data, errors } = await client.query({
      query: GET_ORGS_ROLE,
      // fetchPolicy: "no-cache",
      variables:{
        roleID,
        orgID
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
export async function getStructs(name, org_id) {
  try {
    const { data, errors } = await client.query({
      query: GET_STRUCTURE,
      // fetchPolicy: "no-cache",
      variables:{
        name,
        org_id
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
export const getWorkflowsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/workflow/workflows/${categoryId}`);
    return response.data.map(wf => {
      return {...wf, value: wf.id, label: wf.flow_name};
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    throw error;
  }
};
