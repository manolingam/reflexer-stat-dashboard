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
  Skeleton
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALLSAFES_QUERY, RAIPRICE_QUERY } from '../utils/queries';
import { PageNumbers } from './PageNumbers';
import { formatNumber, calculateLTVRatio } from '../utils/helpers';
import { AiFillCheckCircle } from 'react-icons/ai';
import { MdDisabledByDefault } from 'react-icons/md';

const RECORDS_PER_PAGE = 10;

export const SafesTable = () => {
  const [safes, setSafes] = useState([]);
  const [raiPrice, setRaiPrice] = useState(1);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const {
    data: safesData,
    fetchMore,
    loading
  } = useQuery(ALLSAFES_QUERY, {
    variables: { first: 10, skip: currentPage * RECORDS_PER_PAGE }
  });

  const { data: raiPriceData } = useQuery(RAIPRICE_QUERY);

  useEffect(() => {
    fetchMore({
      variables: { first: 10, skip: currentPage * RECORDS_PER_PAGE }
    });
  }, [currentPage]);

  useEffect(() => {
    if (safesData) {
      let _totalPages = Math.ceil(
        safesData.safes[0].collateralType.safeCount / RECORDS_PER_PAGE
      );
      setTotalPages(_totalPages);
      setSafes(safesData.safes);
    }
  }, [safesData]);

  useEffect(() => {
    if (raiPriceData) {
      setRaiPrice(raiPriceData.dailyStats[0].marketPriceUsd);
    }
  }, [raiPriceData]);

  return (
    <Flex direction='column'>
      <Text fontSize='28px' mb='1rem'>
        All Safes
      </Text>

      <TableContainer>
        <Table variant='striped'>
          <Thead>
            <Tr fontSize='18px'>
              <Th textAlign='left'>ID</Th>
              <Th textAlign='right'>Debt</Th>
              <Th textAlign='right'>Collateral</Th>
              <Th textAlign='right'>Ratio</Th>
              <Th textAlign='center'>Saviour Allowed</Th>
            </Tr>
          </Thead>

          {!loading && (
            <Tbody>
              {safes.length > 0 &&
                safes.map((records, index) => {
                  return (
                    <Tr key={index} fontSize='14px'>
                      <Td>{records.safeId}</Td>
                      <Td textAlign='right'>
                        {formatNumber(records.debt)} RAI
                      </Td>
                      <Td textAlign='right'>
                        {formatNumber(records.collateral)} ETH
                      </Td>
                      <Td textAlign='right'>
                        {calculateLTVRatio(
                          records.collateral,
                          records.collateralType.currentPrice.value,
                          records.debt,
                          raiPrice
                        )}{' '}
                        %
                      </Td>
                      <Td textAlign='center'>
                        <Text>
                          {records.saviour && records.saviour.allowed
                            ? // <AiFillCheckCircle />
                              'Allowed'
                            : // <MdDisabledByDefault />
                              'Not Allowed'}
                        </Text>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          )}

          {loading && (
            <Tbody>
              {Array.from(Array(10).keys()).map((index) => (
                <Tr key={index} fontSize='14px'>
                  <Td>
                    <Box width='100%'>
                      <Skeleton height='16px' py='.5rem' />
                    </Box>
                  </Td>
                  <Td textAlign='right'>
                    <Box width='100%'>
                      <Skeleton height='16px' />
                    </Box>
                  </Td>
                  <Td textAlign='right'>
                    <Box width='100%'>
                      <Skeleton height='16px' />
                    </Box>
                  </Td>
                  <Td textAlign='right'>
                    <Box width='100%'>
                      <Skeleton height='16px' />
                    </Box>
                  </Td>
                  <Td textAlign='center'>
                    <Box width='100%'>
                      <Skeleton height='16px' />
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>

      {totalPages && (
        <PageNumbers
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Flex>
  );
};
