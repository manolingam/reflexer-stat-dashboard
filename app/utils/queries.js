import { gql } from '@apollo/client';

export const SYSTEMSTATE_QUERY = gql`
  query GetSystemState {
    systemStates {
      safeCount
      globalDebt
    }
  }
`;

export const RAIPRICE_QUERY = gql`
  query GetRaiPrice {
    dailyStats(first: 1, orderBy: timestamp, orderDirection: desc) {
      marketPriceUsd
    }
  }
`;

export const ALLSAFES_QUERY = gql`
  query GetAllSafes(
    $first: Int
    $skip: Int
    $orderBy: String
    $orderDirection: String
  ) {
    safes(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      safeId
      collateral
      debt
      collateralType {
        currentPrice {
          value
        }
        safeCount
      }
      saviour {
        allowed
      }
    }
  }
`;

export const SAFE_QUERY = gql`
  query GetSafe($id: String) {
    safe(id: $id) {
      safeId
      collateral
      debt
      owner {
        address
      }
      collateralType {
        currentPrice {
          value
          liquidationPrice
        }
      }
    }
  }
`;

export const SAFE_ACTIVITY_QUERY = gql`
  query GetSafeActivity($id: String) {
    safe(id: $id) {
      modifySAFECollateralization(orderBy: createdAt, orderDirection: desc) {
        deltaDebt
        deltaCollateral
        createdAt
      }
    }
  }
`;
