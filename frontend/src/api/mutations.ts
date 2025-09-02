// File: src/api/mutations.ts
import { gql } from '@apollo/client';

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      product {
        id
        name
        description
        category
        costPrice
        sellingPrice
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      product {
        id
        name
        description
        category
        costPrice
        sellingPrice
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id) {
      success
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      user {
        id
        username
      }
    }
  }
`;