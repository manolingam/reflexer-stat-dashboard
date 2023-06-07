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
  HStack,
  Tooltip,
  Checkbox,
  Spinner,
  Link as ChakraLink,
  VStack
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  ALLSAFES_QUERY_NOT_ZERO,
  ALLSAFES_QUERY_WITH_ZERO,
  ALLSAFES_QUERY_NOT_ZERO_CR_SORT
} from '../utils/queries';
import { PageNumbers } from './PageNumbers';
import {
  formatNumber,
  formatNumberAlphabetical,
  getAccountString,
  getLiquidationPrice,
  getCollateralRatio,
  getLTVRatio
} from '../utils/helpers';
import {
  FaAngleDown,
  FaAngleUp,
  FaInfoCircle,
  FaExternalLinkSquareAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { RxCrossCircled } from 'react-icons/rx';

const RECORDS_PER_PAGE = 50;

export const SafesTable = ({ raiPrice, collateralPrice }) => {
  const router = useRouter();
  const [safes, setSafes] = useState([]);
  const [systemStates, setSystemStates] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [notZeroSafes, setNotZeroSafes] = useState(true);

  const [sortBy, setSortBy] = useState({
    type: 'collateral',
    direction: 'desc'
  });

  const {
    data: safesData,
    fetchMore,
    loading
  } = useQuery(
    notZeroSafes ? ALLSAFES_QUERY_NOT_ZERO : ALLSAFES_QUERY_WITH_ZERO,
    {
      variables: {
        first: RECORDS_PER_PAGE,
        skip: (currentPage - 1) * RECORDS_PER_PAGE,
        orderBy: sortBy.type,
        orderDirection: sortBy.direction
      }
    }
  );

  const { data: safesDataFull } = useQuery(ALLSAFES_QUERY_NOT_ZERO_CR_SORT);

  useEffect(() => {
    if (sortBy.type !== 'CR') {
      fetchMore({
        variables: {
          first: RECORDS_PER_PAGE,
          skip: (currentPage - 1) * RECORDS_PER_PAGE,
          orderBy: sortBy.type,
          orderDirection: sortBy.direction
        }
      });
    } else {
      sortByCR();
    }
  }, [currentPage]);

  useEffect(() => {
    if (safesData) {
      let _totalPages = Math.ceil(
        (notZeroSafes
          ? Number(safesData.systemStates[0].totalActiveSafeCount)
          : Number(safesData.safes[0].collateralType.safeCount)) /
          RECORDS_PER_PAGE
      );
      setTotalPages(_totalPages);
      setSafes(safesData.safes);
      setSystemStates(safesData.systemStates);
    }
  }, [safesData]);

  useEffect(() => {
    if (sortBy.type !== 'CR') {
      fetchMore({
        variables: {
          first: RECORDS_PER_PAGE,
          skip: (currentPage - 1) * RECORDS_PER_PAGE
        }
      });
    } else {
      sortByCR();
    }
  }, [sortBy, notZeroSafes]);

  const sortByCR = async () => {
    let safes = safesDataFull.safes
      .map((safe) => {
        let cr = getCollateralRatio(
          safe.collateral,
          safe.debt,
          safe.collateralType.currentPrice.liquidationPrice,
          safe.collateralType.currentPrice.collateral.liquidationCRatio
        );

        return {
          ...safe,
          CR: cr
        };
      })
      .filter((safe) => safe.CR !== '∞');

    safes.sort((a, b) => {
      return sortBy.direction === 'asc'
        ? Number(a.CR) - Number(b.CR)
        : Number(b.CR) - Number(a.CR);
    });

    let _totalPages = Math.ceil(100 / RECORDS_PER_PAGE);
    let indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
    let indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
    let currentRecords = safes.slice(indexOfFirstRecord, indexOfLastRecord);

    setTotalPages(_totalPages);
    setSafes(currentRecords);
    setSystemStates(safesDataFull.systemStates);
  };

  const updateSortBy = (type) => {
    setSortBy((prevState) => ({
      ...prevState,
      type: type,
      direction: prevState.direction === 'desc' ? 'asc' : 'desc'
    }));
    setCurrentPage(1);
  };

  const updateNotZeroFilter = () => {
    setNotZeroSafes((prevState) => !prevState);
    updateSortBy('collateral');
  };

  return (
    <Flex direction='column'>
      <HStack alignItems='center' justifyContent='space-between' mb='1rem'>
        <VStack w='100%' alignItems='flex-start'>
          <Text fontSize={{ lg: '28px', sm: '18px' }}>All Safes</Text>
          <Checkbox
            isChecked={notZeroSafes}
            onChange={() => updateNotZeroFilter()}
            size='sm'
            opacity='0.7'
          >
            Hide zero collateral safes
          </Checkbox>
        </VStack>
        {totalPages > 0 && (
          <PageNumbers
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </HStack>

      {!loading && (
        <TableContainer>
          <Table variant='unstyled'>
            <Thead border='2px solid white'>
              <Tr fontSize='18px'>
                <Th textAlign='left'>Safe ID</Th>
                <Th textAlign='left'>Owner</Th>
                <Th
                  textAlign='right'
                  onClick={() => updateSortBy('debt')}
                  cursor='pointer'
                  _hover={{
                    opacity: 0.7
                  }}
                >
                  <HStack justifyContent='flex-start'>
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
                  <HStack justifyContent='flex-start'>
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
                <Th
                  textAlign='center'
                  onClick={() => {
                    if (safesDataFull) updateSortBy('CR');
                  }}
                  cursor='pointer'
                  _hover={{
                    opacity: 0.7
                  }}
                >
                  <HStack justifyContent='flex-start'>
                    <Tooltip
                      label='Sort by CR is limited to 100 non zero safes'
                      fontSize='x-small'
                    >
                      <HStack>
                        <FaInfoCircle />
                        <Text>Collateral Ratio</Text>
                        <Flex direction='column'>
                          {sortBy.type === 'CR' ? (
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
                    </Tooltip>
                  </HStack>
                </Th>
                <Th textAlign='center'>Liquidation Price</Th>
                <Th textAlign='center'>LTV</Th>
                <Th textAlign='center'>
                  <Tooltip label='Saviour contract helping to prevent liquidation'>
                    <HStack>
                      <FaInfoCircle />
                      <Text>Saviour</Text>
                    </HStack>
                  </Tooltip>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {safes.length > 0 &&
                safes.map((records, index) => {
                  return (
                    <Tr key={index} fontSize='14px'>
                      <Td>
                        <HStack
                          bg='#3ac1b9'
                          color='black'
                          borderRadius='5px'
                          p='5px'
                          fontWeight='bold'
                          _hover={{ opacity: 0.7 }}
                          cursor='pointer'
                          onClick={() => router.push(`/safe/${records.safeId}`)}
                        >
                          <FaExternalLinkSquareAlt />
                          <Text>{records.safeId}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Tooltip
                          label={records.owner.address}
                          placement='right'
                          fontSize='14px'
                        >
                          <HStack color='#0784c3'>
                            <FaInfoCircle />
                            <ChakraLink
                              href={`https://etherscan.io/address/${records.owner.address}`}
                              isExternal
                            >
                              {getAccountString(records.owner.address)}
                            </ChakraLink>
                          </HStack>
                        </Tooltip>
                      </Td>

                      <Td color='#3ac1b9'>
                        <Tooltip
                          label={` ${new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(
                            Number(formatNumber(records.debt))
                          )} RAI / $ ${new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(
                            Number(formatNumber(records.debt * raiPrice))
                          )}`}
                          placement='right'
                          fontSize='14px'
                        >
                          <HStack>
                            <FaInfoCircle />
                            <Text>
                              {new Intl.NumberFormat('en-US', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).format(
                                Number(formatNumber(records.debt))
                              )}{' '}
                              RAI / ~ $
                              {formatNumberAlphabetical(
                                records.debt * raiPrice
                              )}
                            </Text>
                          </HStack>
                        </Tooltip>
                      </Td>

                      <Td>
                        <Tooltip
                          label={`${new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(
                            Number(formatNumber(records.collateral))
                          )} ETH / $ ${new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(
                            Number(
                              formatNumber(records.collateral * collateralPrice)
                            )
                          )}`}
                          placement='right'
                          fontSize='14px'
                        >
                          <HStack>
                            <FaInfoCircle />
                            <Text>
                              {new Intl.NumberFormat('en-US', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).format(
                                Number(formatNumber(records.collateral))
                              )}
                              ETH / ~ $
                              {formatNumberAlphabetical(
                                records.collateral * collateralPrice
                              )}
                            </Text>
                          </HStack>
                        </Tooltip>
                      </Td>

                      <Td textAlign='center'>
                        {getCollateralRatio(
                          records.collateral,
                          records.debt,
                          records.collateralType.currentPrice.liquidationPrice,
                          records.collateralType.currentPrice.collateral
                            .liquidationCRatio
                        )}{' '}
                        %
                      </Td>
                      <Td textAlign='left'>
                        $
                        {Number(
                          getLiquidationPrice(
                            records.collateral,
                            records.debt,
                            records.collateralType.currentPrice.collateral
                              .liquidationCRatio,
                            systemStates[0].currentRedemptionPrice.value
                          )
                        ).toLocaleString('en-US')}
                      </Td>
                      <Td textAlign='center'>
                        {getLTVRatio(
                          records.collateral,
                          collateralPrice,
                          records.debt,
                          raiPrice
                        )}{' '}
                        %
                      </Td>
                      <Td textAlign='center'>
                        <Flex alignItems='center' justifyContent='center'>
                          <Text
                            textAlign='center'
                            color={
                              records.saviour && records.saviour.allowed
                                ? 'green'
                                : 'red'
                            }
                          >
                            {records.saviour && records.saviour.allowed ? (
                              <FaCheckCircle />
                            ) : (
                              <RxCrossCircled />
                            )}
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {loading && (
        <Flex h='500px' mx='auto' alignItems='center' justifyContent='center'>
          <Spinner color='#3ac1b9' />
        </Flex>
      )}

      {totalPages > 0 && (
        <PageNumbers
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Flex>
  );
};
