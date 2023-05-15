'use client';

import { Flex, Text, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { SafesTable } from './components/SafesTable';
import { SYSTEMSTATE_QUERY } from './utils/queries';
import { useQuery } from '@apollo/client';
import { formatNumber } from './utils/helpers';

export default function Home() {
  const { loading, data } = useQuery(SYSTEMSTATE_QUERY);

  const [raiDebt, setRaiDebt] = useState('');

  useEffect(() => {
    if (data) {
      const globalDebt = data.systemStates[0].globalDebt;
      const formattedDebt = formatNumber(globalDebt);
      setRaiDebt(formattedDebt);
    }
  }, [data]);

  return (
    <Flex direction='column'>
      <Flex direction='row' justifyContent='space-between' mb='4rem'>
        <Flex direction='column'>
          <Text fontSize='28px' mb='1rem'>
            Explore Reflexer Safes
          </Text>
          <Text fontSize='14px' maxW='400px'>
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
                {data.systemStates[0].safeCount}
              </Text>
              <Text fontSize='14px' fontWeight='bold'>
                Safes
              </Text>
              <Text fontSize='14px' opacity='0.7'>
                Total
              </Text>
            </Flex>
            <Flex direction='column' alignItems='left' justifyContent='center'>
              <Text fontSize='24px' mb='.5rem'>
                {data.systemStates[0].totalActiveSafeCount}
              </Text>
              <Text fontSize='14px' fontWeight='bold'>
                Active Safes
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
          </SimpleGrid>
        ) : (
          <Skeleton w='30%' h='100px' />
        )}
      </Flex>

      <SafesTable />
    </Flex>
  );
}
