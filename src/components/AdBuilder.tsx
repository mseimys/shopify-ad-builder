import { useState } from "react";

import { gql, useQuery } from "@apollo/client";
import { Page, Layout, Banner, Card, Modal } from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";

import { ProductsList } from "./ProductsList";
// GraphQL query to retrieve products by IDs.
// The price field belongs to the variants object because
// product variants can have different prices.
const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;
export function AdBuilder({ productId }) {
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_ID, {
    variables: { ids: [productId] },
  });
  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  return <ProductsList data={data} />;
}
