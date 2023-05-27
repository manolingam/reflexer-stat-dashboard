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
import { ALLSAFES_QUERY } from '../utils/queries';
import { PageNumbers } from './PageNumbers';
import {
  formatNumber,
  collateralRatio,
  getAccountString,
  calculateLiquidationPercentage
} from '../utils/helpers';
import { FaEthereum } from 'react-icons/fa';
import { FaAngleDown, FaAngleUp, FaArrowRight } from 'react-icons/fa';

const RECORDS_PER_PAGE = 10;

export const SafesTable = ({ raiPrice, collateralPrice }) => {
  const router = useRouter();
  const [safes, setSafes] = useState([]);

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
      <Text fontSize='28px' mb='1rem' opacity='0.7'>
        All Safes
      </Text>

      <TableContainer>
        <Table variant='unstyled'>
          <Thead bg='#3ac1b9'>
            <Tr fontSize='18px'>
              <Th textAlign='left' color='black'>
                Safe ID
              </Th>
              <Th textAlign='left' color='black'>
                Owner
              </Th>
              <Th
                textAlign='right'
                onClick={() => updateSortBy('debt')}
                cursor='pointer'
                _hover={{
                  opacity: 0.7
                }}
              >
                <HStack justifyContent='flex-end' color='black'>
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
                textAlign='right'
                onClick={() => updateSortBy('collateral')}
                cursor='pointer'
                _hover={{
                  opacity: 0.7
                }}
              >
                <HStack justifyContent='flex-end' color='black'>
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
              <Th textAlign='center' color='black'>
                Collateral Ratio
              </Th>

              <Th textAlign='center' color='black'>
                Liquidation Price
              </Th>

              <Th textAlign='center' color='black'>
                Saviour Enabled
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
                      onClick={() => router.push(`/safe/${records.safeId}`)}
                    >
                      <Td>
                        <Text>{records.safeId}</Text>
                      </Td>
                      <Td>
                        <Text>{getAccountString(records.owner.address)}</Text>
                      </Td>

                      <Td textAlign='right'>
                        <HStack justifyContent='flex-end'>
                          <FaEthereum />{' '}
                          <Text>
                            {formatNumber(records.collateral)} ETH / $
                            {formatNumber(records.collateral * collateralPrice)}
                          </Text>
                        </HStack>
                      </Td>

                      <Td textAlign='right'>
                        {formatNumber(records.debt)} RAI / $
                        {formatNumber(records.debt * raiPrice)}
                      </Td>

                      <Td textAlign='center'>
                        {collateralRatio(
                          records.collateral,
                          records.collateralType.currentPrice.value,
                          records.debt,
                          raiPrice
                        )}{' '}
                        %
                      </Td>
                      <Td textAlign='center'>
                        $
                        {formatNumber(
                          records.collateralType.currentPrice.liquidationPrice
                        )}{' '}
                        /{' '}
                        {calculateLiquidationPercentage(
                          collateralPrice * records.collateral,
                          raiPrice * records.debt,
                          records.collateralType.currentPrice.liquidationPrice
                        )}{' '}
                        %
                      </Td>

                      <Td textAlign='center'>
                        <Text>
                          {records.saviour && records.saviour.allowed
                            ? 'Enabled'
                            : 'Disabled'}
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
