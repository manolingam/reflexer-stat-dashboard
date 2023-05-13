'use client';

import { Flex, Text, Box, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { SafesTable } from './components/SafesTable';
import { SYSTEMSTATE_QUERY } from './utils/queries';
import { useQuery } from '@apollo/client';
import { formatNumber } from './utils/helpers';
import { BsFillArrowRightSquareFill } from 'react-icons/bs';

export default function Home() {
  const { loading, error, data } = useQuery(SYSTEMSTATE_QUERY);

  const [raiDebt, setRaiDebt] = useState('');
  const [safeCount, setSafeCount] = useState('');

  useEffect(() => {
    if (data) {
      const globalDebt = data.systemStates[0].globalDebt;
      const formattedDebt = formatNumber(globalDebt);
      setRaiDebt(formattedDebt);
      setSafeCount(data.systemStates[0].safeCount);
    }
  }, [data]);

  return (
    <Box py='2rem' px='4rem'>
      <Flex direction='column'>
        <Flex mb='2rem'>
          <Text fontSize='48px'>Reflexer Finance</Text>
        </Flex>

        <Flex direction='row' justifyContent='space-between' mb='4rem'>
          <Flex direction='column'>
            <Text fontSize='28px' mb='1rem'>
              Explore Reflexer Safes
            </Text>
            <Text fontSize='14px' maxW='70%'>
              Find current and historical information on collateralised debt
              positions in the reflexer protocol
            </Text>
          </Flex>

          {!loading ? (
            <SimpleGrid columns='3' gap='5'>
              <Flex
                direction='column'
                mr='2rem'
                alignItems='left'
                justifyContent='center'
              >
                <Text fontSize='24px' mb='.5rem'>
                  {safeCount}
                </Text>
                <Text fontSize='14px' fontWeight='bold'>
                  Safes
                </Text>
                <Text fontSize='14px' opacity='0.7'>
                  Total
                </Text>
              </Flex>
              <Flex
                direction='column'
                mr='2rem'
                alignItems='left'
                justifyContent='center'
              >
                <Text fontSize='24px' mb='.5rem'>
                  {raiDebt}
                </Text>
                <Text fontSize='14px' fontWeight='bold'>
                  RAI
                </Text>
                <Text fontSize='14px' opacity='0.7'>
                  Debt
                </Text>
              </Flex>
              <Flex
                direction='column'
                alignItems='left'
                justifyContent='center'
              >
                <Text fontSize='24px' mb='1rem'>
                  <BsFillArrowRightSquareFill />
                </Text>
                <Text fontSize='14px' fontWeight='bold'>
                  Stats
                </Text>
                <Text fontSize='14px' opacity='0.7'>
                  View More
                </Text>
              </Flex>
            </SimpleGrid>
          ) : (
            <Skeleton w='30%' h='100px' />
          )}
        </Flex>

        <SafesTable />
      </Flex>
    </Box>
  );
}
