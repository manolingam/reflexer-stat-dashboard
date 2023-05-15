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
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALLSAFES_QUERY, RAIPRICE_QUERY } from '../utils/queries';
import { PageNumbers } from './PageNumbers';
import {
  formatNumber,
  calculateLTVRatio,
  getAccountString
} from '../utils/helpers';
import { FaEthereum } from 'react-icons/fa';
import { FaAngleDown, FaAngleUp, FaArrowRight } from 'react-icons/fa';

const RECORDS_PER_PAGE = 10;

export const SafesTable = () => {
  const router = useRouter();
  const [safes, setSafes] = useState([]);
  const [raiPrice, setRaiPrice] = useState(1);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [sortBy, setSortBy] = useState({
    type: 'collateral',
    direction: 'desc'
  });

  const {
    data: safesData,
    fetchMore,
    loading
  } = useQuery(ALLSAFES_QUERY, {
    variables: {
      first: 10,
      skip: currentPage * RECORDS_PER_PAGE,
      orderBy: sortBy.type,
      orderDirection: sortBy.direction
    }
  });

  const { data: raiPriceData } = useQuery(RAIPRICE_QUERY);

  useEffect(() => {
    fetchMore({
      variables: {
        first: 10,
        skip: currentPage * RECORDS_PER_PAGE,
        orderBy: sortBy.type,
        orderDirection: sortBy.direction
      }
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

  useEffect(() => {
    fetchMore({
      variables: { first: 10, skip: currentPage * RECORDS_PER_PAGE }
    });
  }, [sortBy]);

  const updateSortBy = (type) => {
    setSortBy((prevState) => ({
      ...prevState,
      type: type,
      direction: prevState.direction === 'desc' ? 'asc' : 'desc'
    }));
    setCurrentPage(0);
  };

  return (
    <Flex direction='column'>
      <Text fontSize='28px' mb='1rem'>
        All Safes
      </Text>

      <TableContainer>
        <Table variant='striped'>
          <Thead bg='black'>
            <Tr fontSize='18px'>
              <Th textAlign='left' color='#e2e8f0'>
                ID
              </Th>
              <Th
                color='#e2e8f0'
                textAlign='right'
                onClick={() => updateSortBy('debt')}
                cursor='pointer'
                _hover={{
                  opacity: 0.7
                }}
              >
                <HStack justifyContent='flex-end'>
                  <Text>Debt</Text>
                  <Flex direction='column'>
                    {sortBy.type === 'debt' ? (
                      sortBy.direction === 'desc' ? (
                        <FaAngleUp />
                      ) : (
                        <FaAngleDown />
                      )
                    ) : (
                      <>
                        <FaAngleUp /> <FaAngleDown />
                      </>
                    )}
                  </Flex>
                </HStack>
              </Th>
              <Th
                color='#e2e8f0'
                textAlign='right'
                onClick={() => updateSortBy('collateral')}
                cursor='pointer'
                _hover={{
                  opacity: 0.7
                }}
              >
                <HStack justifyContent='flex-end'>
                  <Text>Collateral</Text>
                  <Flex direction='column'>
                    {sortBy.type === 'collateral' ? (
                      sortBy.direction === 'desc' ? (
                        <FaAngleUp />
                      ) : (
                        <FaAngleDown />
                      )
                    ) : (
                      <>
                        <FaAngleUp /> <FaAngleDown />
                      </>
                    )}
                  </Flex>
                </HStack>
              </Th>
              <Th textAlign='right' color='#e2e8f0'>
                Ratio
              </Th>
              <Th textAlign='center' color='#e2e8f0'>
                Saviour Allowed
              </Th>
              <Th></Th>
            </Tr>
          </Thead>

          {!loading && (
            <Tbody>
              {safes.length > 0 &&
                safes.map((records, index) => {
                  return (
                    <Tr
                      key={index}
                      fontSize='14px'
                      cursor='pointer'
                      _hover={{ opacity: 0.7 }}
                      onClick={() => router.push(`/safe/${records.id}`)}
                    >
                      <Td>
                        <HStack>
                          <FaEthereum />{' '}
                          <Text>{getAccountString(records.id)}</Text>
                        </HStack>
                      </Td>
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
                            ? 'Allowed'
                            : 'Not Allowed'}
                        </Text>
                      </Td>

                      <Td textAlign='center'>
                        <FaArrowRight />
                      </Td>
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
                  <Td textAlign='center'>
                    <Box width='100%'>
                      <Skeleton height='20px' py='.5rem' />
                    </Box>
                  </Td>
                  <Td textAlign='center'>
                    <Box width='100%'>
                      <Skeleton height='18px' py='.5rem' />
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
