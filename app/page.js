'use client';

import {
  Flex,
  Text,
  SimpleGrid,
  Skeleton,
  Link as ChakraLink
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { SafesTable } from './components/SafesTable';
import { SYSTEMSTATE_QUERY } from './utils/queries';
import { useQuery } from '@apollo/client';
import { formatNumber, getCollateralRatio } from './utils/helpers';

export default function Home() {
  const { loading, data } = useQuery(SYSTEMSTATE_QUERY);

  const [raiDebt, setRaiDebt] = useState('');
  const [collateral, setCollateral] = useState('');
  const [raiPrice, setRaiPrice] = useState('');
  const [collateralPrice, setCollateralPrice] = useState('');
  const [liquidationPrice, setLiquidationPrice] = useState('');
  const [liquidationCRatio, setLiquidationCRatio] = useState('');

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
      setLiquidationPrice(
        data.safes[0].collateralType.currentPrice.liquidationPrice
      );
      setLiquidationCRatio(
        data.safes[0].collateralType.currentPrice.collateral.liquidationCRatio
      );
    }
  }, [data]);

  return (
    <Flex direction='column'>
      <Flex direction='column' justifyContent='space-between' mb='4rem'>
        <Flex direction='column' mb='2rem'>
          <Text fontSize={{ lg: '28px', sm: '18px' }} mb='1rem'>
            Explore Reflexer Safes
          </Text>
          <Text
            fontSize={{ lg: '16px', sm: '14px' }}
            maxW='800px'
            opacity='0.7'
          >
            Find current and historical information on collateralised debt
            positions in the Reflexer protocol.
          </Text>
        </Flex>

        <Text fontSize={{ lg: '28px', sm: '18px' }} mb='1rem'>
          Global Stats
        </Text>
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
                {new Intl.NumberFormat('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 0
                }).format(Number(data.systemStates[0].safeCount))}
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
                {new Intl.NumberFormat('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 2
                }).format(Number(formatNumber(raiDebt)))}
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
                {new Intl.NumberFormat('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 2
                }).format(Number(formatNumber(collateral)))}
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
                {getCollateralRatio(
                  collateral,
                  raiDebt,
                  liquidationPrice,
                  liquidationCRatio
                )}
                %
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                CR
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                Collateral Ratio
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
                ${' '}
                {Number(formatNumber(collateralPrice)).toLocaleString('en-US')}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                ETH
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                Price
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
                ${' '}
                {Number(
                  formatNumber(
                    data.systemStates[0].currentRedemptionPrice.value
                  )
                ).toLocaleString('en-US')}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                Redemption Price
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                RAI
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
                {Number(
                  data.systemStates[0].currentRedemptionPrice.redemptionRate
                ).toFixed(2)}{' '}
                %
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                Redemption Rate
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                RAI
              </Text>
            </Flex>
            <Flex
              direction='row'
              mr={{ lg: '2rem', sm: 0 }}
              alignItems='center'
              justifyContent='flex-start'
            >
              <ChakraLink
                textDecoration='underline'
                wordBreak='break-word'
                mr='1rem'
                cursor='pointer'
                _hover={{ opacity: 0.7 }}
                href='https://stats.reflexer.finance/'
                isExternal
              >
                Click for more stats..
              </ChakraLink>
            </Flex>
          </SimpleGrid>
        ) : (
          <Skeleton w='30%' h='100px' />
        )}
      </Flex>

      <SafesTable raiPrice={raiPrice} collateralPrice={collateralPrice} />
    </Flex>
  );
}
