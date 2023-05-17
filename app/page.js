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
      <Flex
        direction={{ lg: 'row', sm: 'column' }}
        justifyContent='space-between'
        mb='4rem'
      >
        <Flex direction='column' mb={{ lg: 0, sm: '2rem' }}>
          <Text fontSize={{ lg: '28px', sm: '18px' }} mb='1rem'>
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
              mr={{ lg: '2rem', sm: 0 }}
              alignItems='left'
              justifyContent='center'
            >
              <Text fontSize={{ lg: '24px', sm: '18px' }} mb='.5rem'>
                {data.systemStates[0].safeCount}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                Safes
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                Total
              </Text>
            </Flex>
            <Flex direction='column' alignItems='left' justifyContent='center'>
              <Text fontSize={{ lg: '24px', sm: '18px' }} mb='.5rem'>
                {data.systemStates[0].totalActiveSafeCount}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                Active Safes
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                Total
              </Text>
            </Flex>
            <Flex
              direction='column'
              mr={{ lg: '2rem', sm: 0 }}
              alignItems='left'
              justifyContent='center'
            >
              <Text fontSize={{ lg: '24px', sm: '18px' }} mb='.5rem'>
                {raiDebt}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                RAI
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
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
