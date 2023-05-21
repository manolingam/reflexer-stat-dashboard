'use client';

import { Flex, Text, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { SafesTable } from './components/SafesTable';
import { SYSTEMSTATE_QUERY } from './utils/queries';
import { useQuery } from '@apollo/client';
import { formatNumber, collateralRatio } from './utils/helpers';

export default function Home() {
  const { loading, data } = useQuery(SYSTEMSTATE_QUERY);

  const [raiDebt, setRaiDebt] = useState('');
  const [collateral, setCollateral] = useState('');
  const [raiPrice, setRaiPrice] = useState('');
  const [collateralPrice, setCollateralPrice] = useState('');

  useEffect(() => {
    if (data) {
      const globalDebt = data.systemStates[0].globalDebt;

      const globalCollateral =
        data.collateralPrices[0].collateral.totalCollateral;

      setRaiPrice(data.dailyStats[0].marketPriceUsd);
      setCollateralPrice(
        data.collateralPrices[0].collateral.currentPrice.value
      );
      setRaiDebt(globalDebt);
      setCollateral(globalCollateral);
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
              <Text
                fontSize={{ lg: '28px', sm: '18px' }}
                mb='.5rem'
                background='linear-gradient(to right, #41c1d0, #1a6c51)'
                backgroundClip='text'
                fontWeight='extrabold'
              >
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
              <Text
                fontSize={{ lg: '28px', sm: '18px' }}
                mb='.5rem'
                background='linear-gradient(to right, #41c1d0, #1a6c51)'
                backgroundClip='text'
                fontWeight='extrabold'
              >
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
              <Text
                fontSize={{ lg: '28px', sm: '18px' }}
                mb='.5rem'
                background='linear-gradient(to right, #41c1d0, #1a6c51)'
                backgroundClip='text'
                fontWeight='extrabold'
              >
                {formatNumber(raiDebt)}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                RAI
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                Debt
              </Text>
            </Flex>
            <Flex
              direction='column'
              mr={{ lg: '2rem', sm: 0 }}
              alignItems='left'
              justifyContent='center'
            >
              <Text
                fontSize={{ lg: '28px', sm: '18px' }}
                mb='.5rem'
                background='linear-gradient(to right, #41c1d0, #1a6c51)'
                backgroundClip='text'
                fontWeight='extrabold'
              >
                {formatNumber(collateral)}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                ETH
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                Collateral
              </Text>
            </Flex>
            <Flex
              direction='column'
              mr={{ lg: '2rem', sm: 0 }}
              alignItems='left'
              justifyContent='center'
            >
              <Text
                fontSize={{ lg: '28px', sm: '18px' }}
                mb='.5rem'
                background='linear-gradient(to right, #41c1d0, #1a6c51)'
                backgroundClip='text'
                fontWeight='extrabold'
              >
                {collateralRatio(
                  collateral,
                  collateralPrice,
                  raiDebt,
                  raiPrice
                )}{' '}
                %
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                CR
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                Collateral Ratio
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
