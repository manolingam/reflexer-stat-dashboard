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
  Spinner,
  HStack,
  Tooltip
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { SAFE_ACTIVITY_QUERY } from '../utils/queries';
import {
  formatNumber,
  formatNumberAlphabetical,
  getActivityName,
  getActivityBool
} from '../utils/helpers';
import {
  FaInfoCircle,
  FaLongArrowAltUp,
  FaLongArrowAltDown,
  FaArrowsAlt
} from 'react-icons/fa';

export const SafeTable = ({ safeId, collateralPrice, debtPrice }) => {
  const [activity, setActivity] = useState([]);

  const { data, loading } = useQuery(SAFE_ACTIVITY_QUERY, {
    variables: {
      id: safeId
    }
  });

  useEffect(() => {
    if (data) {
      setActivity(data.safe.modifySAFECollateralization);
    }
  }, [data]);

  return (
    <Flex direction='column'>
      <Text fontSize={{ lg: '28px', sm: '22px' }} mb='1rem'>
        Activities
      </Text>

      {!loading && (
        <TableContainer>
          <Table variant='unstyled'>
            <Thead border='2px solid white'>
              <Tr fontSize='18px'>
                <Th textAlign='left'>Type</Th>
                <Th>Collateral Change</Th>
                <Th>Debt Change</Th>
                <Th textAlign='right'>Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {activity.length > 0 &&
                activity.map((records, index) => {
                  return (
                    <Tr key={index} fontSize='14px'>
                      <Td>
                        <HStack>
                          {getActivityBool(
                            records.deltaDebt,
                            records.deltaCollateral
                          ) === 'increase' ? (
                            <FaLongArrowAltUp />
                          ) : getActivityBool(
                              records.deltaDebt,
                              records.deltaCollateral
                            ) === 'decrease' ? (
                            <FaLongArrowAltDown />
                          ) : (
                            <FaArrowsAlt />
                          )}
                          <Text>
                            {getActivityName(
                              records.deltaDebt,
                              records.deltaCollateral
                            )}
                          </Text>
                        </HStack>
                      </Td>
                      <Td color='#3ac1b9'>
                        <Tooltip
                          label={`${formatNumber(
                            records.deltaCollateral
                          )} ETH / ${formatNumber(
                            records.deltaCollateral * collateralPrice
                          )}`}
                        >
                          <HStack>
                            <FaInfoCircle />
                            <Text>
                              {formatNumberAlphabetical(
                                records.deltaCollateral,
                                2
                              )}{' '}
                              ETH / $
                              {formatNumberAlphabetical(
                                records.deltaCollateral * collateralPrice,
                                2
                              )}
                            </Text>
                          </HStack>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip
                          label={`${formatNumber(
                            records.deltaDebt
                          )} RAI / $ ${formatNumber(
                            records.deltaDebt * debtPrice
                          )}`}
                        >
                          <HStack>
                            <FaInfoCircle />
                            <Text>
                              {formatNumberAlphabetical(records.deltaDebt, 2)}{' '}
                              RAI / $
                              {formatNumberAlphabetical(
                                records.deltaDebt * debtPrice,
                                2
                              )}
                            </Text>
                          </HStack>
                        </Tooltip>
                      </Td>
                      <Td textAlign='right'>
                        {new Date(Number(records.createdAt) * 1000)
                          .toLocaleString()
                          .toString()
                          .replaceAll('/', '-')}
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {loading && (
        <Flex h='200px' mx='auto' alignItems='center' justifyContent='center'>
          <Spinner color='#3ac1b9' />
        </Flex>
      )}
    </Flex>
  );
};
