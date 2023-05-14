'use client';

import {
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Skeleton,
  HStack
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { SAFE_ACTIVITY_QUERY, RAIPRICE_QUERY } from '../utils/queries';
import { PageNumbers } from './PageNumbers';
import { formatNumber, calculateLTVRatio } from '../utils/helpers';
import { FaEthereum } from 'react-icons/fa';
import { FaAngleDown, FaAngleUp, FaArrowRight } from 'react-icons/fa';

const RECORDS_PER_PAGE = 10;

export const SafeTable = ({ safeId }) => {
  const [activity, setActivity] = useState([]);
  const [raiPrice, setRaiPrice] = useState(1);

  const { data, loading } = useQuery(SAFE_ACTIVITY_QUERY, {
    variables: {
      id: safeId
    }
  });

  const { data: raiPriceData } = useQuery(RAIPRICE_QUERY);

  useEffect(() => {
    if (data) {
      setActivity(data.safe.modifySAFECollateralization);
    }
  }, [data]);

  useEffect(() => {
    if (raiPriceData) {
      setRaiPrice(raiPriceData.dailyStats[0].marketPriceUsd);
    }
  }, [raiPriceData]);

  return (
    <Flex direction='column'>
      <TableContainer>
        <Table variant='striped'>
          <Thead bg='black'>
            <Tr fontSize='18px'>
              <Th textAlign='left' color='#e2e8f0'>
                Activity
              </Th>
              <Th textAlign='right' color='#e2e8f0'>
                Collateral Change
              </Th>
              <Th textAlign='right' color='#e2e8f0'>
                Debt Change
              </Th>
              <Th textAlign='right' color='#e2e8f0'>
                Timestamp
              </Th>
            </Tr>
          </Thead>

          {!loading && (
            <Tbody>
              {activity.length > 0 &&
                activity.map((records, index) => {
                  return (
                    <Tr
                      key={index}
                      fontSize='14px'
                      cursor='pointer'
                      _hover={{ opacity: 0.7 }}
                    >
                      <Td>#name</Td>
                      <Td textAlign='right'>
                        {formatNumber(records.deltaCollateral)} ETH
                      </Td>
                      <Td textAlign='right'>
                        {formatNumber(records.deltaDebt)} RAI
                      </Td>
                      <Td textAlign='right'>
                        {new Date(
                          Number(records.createdAt) * 1000
                        ).toDateString()}
                      </Td>
                      {/* <Td textAlign='right'>
                        {calculateLTVRatio(
                          records.collateral,
                          records.collateralType.currentPrice.value,
                          records.debt,
                          raiPrice
                        )}{' '}
                        %
                      </Td> */}
                    </Tr>
                  );
                })}
            </Tbody>
          )}

          {loading && (
            <Tbody>
              {Array.from(Array(10).keys()).map((index) => (
                <Tr key={index} fontSize='18px'>
                  <Td>
                    <Box width='100%'>
                      <Skeleton height='20px' py='.5rem' />
                    </Box>
                  </Td>
                  <Td textAlign='right'>
                    <Box width='100%'>
                      <Skeleton height='20px' py='.5rem' />
                    </Box>
                  </Td>
                  <Td textAlign='right'>
                    <Box width='100%'>
                      <Skeleton height='20px' py='.5rem' />
                    </Box>
                  </Td>
                  <Td textAlign='right'>
                    <Box width='100%'>
                      <Skeleton height='20px' py='.5rem' />
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
    </Flex>
  );
};
