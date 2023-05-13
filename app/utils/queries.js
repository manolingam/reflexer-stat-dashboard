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
  query GetAllSafes($first: Int, $skip: Int) {
    safes(
      first: $first
      skip: $skip
      orderBy: collateral
      orderDirection: desc
    ) {
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
