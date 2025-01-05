import { gql } from "@apollo/client";

export const GET_ALL_ANNONCES = gql`
  query GetAllAnnonces {
    getAllAnnonces {
      id
      description
      price
      bedrooms
      bathrooms
      address {
        city
        street
      }
    }
  }
`;
