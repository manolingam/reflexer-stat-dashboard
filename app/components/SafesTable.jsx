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
  CircularProgressLabel,
  Link as ChakraLink,
  VStack,
  CircularProgress
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import { useQuery } from '@apollo/client';
import {
  ALLSAFES_QUERY_NOT_ZERO,
  ALLSAFES_QUERY_WITH_ZERO
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

import { AppContext } from '../context/AppContext';

const RECORDS_PER_PAGE = 50;

export const SafesTable = ({ raiPrice, collateralPrice }) => {
  const router = useRouter();
  const context = useContext(AppContext);
  const [currentRecords, setCurrentRecords] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [aPage, setAPage] = useState(0);

  const [progressPercent, setProgressPercent] = useState(0);

  const [notZeroSafes, setNotZeroSafes] = useState(true);
  const [sortBy, setSortBy] = useState({
    type: 'collateral',
    direction: 'desc'
  });

  const [loading, setLoading] = useState(true);

  const { fetchMore } = useQuery(
    notZeroSafes ? ALLSAFES_QUERY_NOT_ZERO : ALLSAFES_QUERY_WITH_ZERO,
    {
      variables: {
        first: RECORDS_PER_PAGE,
        skip: (currentPage - 1) * RECORDS_PER_PAGE,
        orderBy: sortBy.type === 'CR' ? 'collateral' : sortBy.type,
        orderDirection: sortBy.direction
      }
    }
  );

  const performSorts = () => {
    let _safes = [];
    if (sortBy.type === 'CR') {
      _safes = (notZeroSafes ? context.nonZeroSafes : context.zeroSafes)
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

      _safes.sort((a, b) => {
        return sortBy.direction === 'asc'
          ? Number(a.CR) - Number(b.CR)
          : Number(b.CR) - Number(a.CR);
      });
    }

    if (sortBy.type === 'collateral') {
      _safes = notZeroSafes ? context.nonZeroSafes : context.zeroSafes;

      _safes.sort((a, b) => {
        return sortBy.direction === 'asc'
          ? Number(a.collateral) - Number(b.collateral)
          : Number(b.collateral) - Number(a.collateral);
      });
    }

    if (sortBy.type === 'debt') {
      _safes = notZeroSafes ? context.nonZeroSafes : context.zeroSafes;

      _safes.sort((a, b) => {
        return sortBy.direction === 'asc'
          ? Number(a.debt) - Number(b.debt)
          : Number(b.debt) - Number(a.debt);
      });
    }

    let _totalPages = Math.ceil(_safes.length / RECORDS_PER_PAGE);
    setTotalPages(_totalPages);

    cropRecords(_safes, currentPage);
    setLoading(false);
  };

  const loadMore = async (_first, _skip) => {
    fetchMore({
      variables: {
        first: _first,
        skip: _skip,
        orderBy: sortBy.type === 'CR' ? 'collateral' : sortBy.type,
        orderDirection: sortBy.direction
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (fetchMoreResult && fetchMoreResult.safes.length > 0) {
          if (notZeroSafes && !context.nonZeroSafesStored) {
            context.setNonZeroSafes([
              ...context.nonZeroSafes,
              ...fetchMoreResult.safes
            ]);
            setProgressPercent(
              ((aPage * 100) /
                fetchMoreResult.systemStates[0].totalActiveSafeCount) *
                100
            );
          } else if (!notZeroSafes && !context.zeroSafesStored) {
            context.setZeroSafes([
              ...context.zeroSafes,
              ...fetchMoreResult.safes
            ]);
            setProgressPercent(
              ((aPage * 100) /
                fetchMoreResult.safes[0].collateralType.safeCount) *
                100
            );
          }

          setAPage(aPage + 1);
        } else {
          if (!notZeroSafes) {
            context.setZeroSafesStored(true);
          } else {
            context.setNonZeroSafesStored(true);
          }
          context.setSystemStates(fetchMoreResult.systemStates);
          performSorts();
        }
      }
    });
  };

  const paginate = (_safes, _pageNumber) => {
    _pageNumber ? setCurrentPage(_pageNumber) : null;
    const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
    const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
    const currentRecords = _safes.slice(indexOfFirstRecord, indexOfLastRecord);
    setCurrentRecords(currentRecords);
  };

  const cropRecords = (_safes, _page) => {
    setTotalPages(Math.ceil(_safes.length / RECORDS_PER_PAGE));
    paginate(_safes, _page);
  };

  useEffect(() => {
    if (!context.zeroSafesStored || !context.nonZeroSafesStored) {
      loadMore(100, aPage * 100);
    }
  }, [aPage]);

  useEffect(() => {
    setLoading(true);
    setCurrentRecords([]);
    performSorts();
  }, [sortBy]);

  useEffect(() => {
    setLoading(true);
    setCurrentRecords([]);
    if (!notZeroSafes && context.zeroSafesStored) {
      performSorts();
    } else if (notZeroSafes && context.nonZeroSafesStored) {
      performSorts();
    } else {
      setAPage(0);
    }
  }, [notZeroSafes]);

  useEffect(() => {
    if (sortBy.type === 'CR') {
      performSorts();
    } else {
      cropRecords(
        notZeroSafes ? context.nonZeroSafes : context.zeroSafes,
        currentPage
      );
    }
  }, [currentPage]);

  const updateSortBy = (type) => {
    setSortBy((prevState) => ({
      ...prevState,
      type: type,
      direction: prevState.direction === 'desc' ? 'asc' : 'desc'
    }));
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
                  onClick={() => {
                    updateSortBy('debt');
                  }}
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
                    updateSortBy('CR');
                  }}
                  cursor='pointer'
                  _hover={{
                    opacity: 0.7
                  }}
                >
                  <HStack justifyContent='flex-start'>
                    <HStack>
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
              {currentRecords.length > 0 &&
                currentRecords.map((records, index) => {
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
                            records.debt *
                              records.collateralType.accumulatedRate,
                            records.collateralType.currentPrice.collateral
                              .liquidationCRatio,
                            context.systemStates[0].currentRedemptionPrice.value
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
        <Flex
          flexDirection='column'
          h='500px'
          mx='auto'
          alignItems='center'
          justifyContent='center'
        >
          <CircularProgress
            value={progressPercent}
            size='50px'
            color='#3ac1b9'
            thickness='4px'
            mb='1rem'
          >
            <CircularProgressLabel>
              {Math.round(progressPercent)} %
            </CircularProgressLabel>
          </CircularProgress>
          <Text fontSize='xs'>
            Data is loaded only upon start up. Please wait.
          </Text>
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
