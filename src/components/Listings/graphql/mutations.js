import { gql } from "@apollo/client";

export const CREATE_ANNONCE = gql`
  mutation CreateAnnonce($annonce: AnnonceInput!) {
    createAnnonce(annonce: $annonce) {
      id
      description
      price
      address {
        city
        street
      }
    }
  }
`;
