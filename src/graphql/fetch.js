import { client } from "./clients.js";
import {
  GET_ANNOUNCEMENT,
  GET_ANNOUNCEMENT_LIMIT,
  GET_ROLES,
  GET_USERS_BY_ROLE,
  LUT_OTOR_REGION,
  LUT_OTOR_YEAR
} from "~/graphql/queries";

export async function getRoles() {
  try {
    const { data, errors } = await client.query({
      query: GET_ROLES,
    });

    if (errors && errors.length) {
      console.error("GraphQL Errors:", errors.map((e) => e.message).join(", "));
      throw new Error(`Failed to fetch POS data: ${errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch POS data:", error);
    throw error;
  }
}

export async function getUsersByRole(role_id) {
  try {
    const { data, errors } = await client.query({
      query: GET_USERS_BY_ROLE,
      // fetchPolicy: "no-cache",
      variables: {
        role_id,
      },
    });

    if (errors && errors.length) {
      console.error("GraphQL Errors:", errors.map((e) => e.message).join(", "));
      throw new Error(`Failed to fetch POS data: ${errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch POS data:", error);
    throw error;
  }
}

export async function getAnnouncementList(page, size, year_id, region_id) {
  try {
    const { data, errors } = await client.query({
      query: GET_ANNOUNCEMENT,
      fetchPolicy: "no-cache",
      variables: {
        "sorts": [
          {
            "column": "created_at",
            "order": "desc"
          }
        ],
        "filters": [
          {
            "column": "otor_year_id",
            "condition": "equals",
            "value": year_id
          },
          {
            "column": "otor_region_id",
            "condition": "equals",
            "value": region_id
          }
        ],
        page,
        size
      }
    });

    if (errors && errors.length) {
      console.error('GraphQL Errors:', errors.map(e => e.message).join(', '));
      throw new Error(`Failed to fetch news data: ${errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch news data:', error);
    throw error;
  }
}

export async function getAnnouncementListLimit() {
  try {
    const { data, errors } = await client.query({
      query: GET_ANNOUNCEMENT_LIMIT,
      // fetchPolicy: "no-cache",
      variables:{
        "sorts": [
          {
            "column": "created_at",
            "order": "desc"
          }
        ],
        "limit": 8
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

export async function getLutOtorYear() {
  try {
    const { data, errors } = await client.query({
      query: LUT_OTOR_YEAR,
    });

    if (errors && errors.length) {
      console.error("GraphQL Errors:", errors.map((e) => e.message).join(", "));
      throw new Error(`Failed to fetch POS data: ${errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch POS data:", error);
    throw error;
  }
}

export async function getLutOtorRegion() {
  try {
    const { data, errors } = await client.query({
      query: LUT_OTOR_REGION,
    });

    if (errors && errors.length) {
      console.error("GraphQL Errors:", errors.map((e) => e.message).join(", "));
      throw new Error(`Failed to fetch POS data: ${errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch POS data:", error);
    throw error;
  }
}
