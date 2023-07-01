'use client';

import {
  Flex,
  Text,
  SimpleGrid,
  Skeleton,
  Link as ChakraLink
} from '@chakra-ui/react';
import { useEffect, useContext } from 'react';
import { SafesTable } from './components/SafesTable';
import { SYSTEMSTATE_QUERY } from './utils/queries';
import { useQuery } from '@apollo/client';
import { formatNumber, getCollateralRatio } from './utils/helpers';
import { AppContext } from './context/AppContext';

import { FaExternalLinkSquareAlt } from 'react-icons/fa';

export default function Home() {
  const { loading, data } = useQuery(SYSTEMSTATE_QUERY);
  const context = useContext(AppContext);

  useEffect(() => {
    if (data) {
      context.setStandardStats(
        data.systemStates[0].safeCount,
        data.systemStates[0].totalActiveSafeCount,
        data.systemStates[0].globalDebt,
        data.systemStates[0].currentRedemptionPrice.value,
        data.redemptionRates[0].annualizedRate,
        data.collateralPrices[0].collateral.totalCollateral,
        data.collateralPrices[0].collateral.currentPrice.value,
        data.dailyStats[0].marketPriceUsd,
        data.safes[0].collateralType.currentPrice.collateral.liquidationCRatio,
        data.safes[0].collateralType.currentPrice.liquidationPrice
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
                }).format(Number(context.safeCount))}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                Total Safes
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
                {context.activeSafesCount}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                Active Safes
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
                {new Intl.NumberFormat('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(Number(formatNumber(context.collateralPrice)))}{' '}
                USD
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                ETH Price
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
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(Number(formatNumber(context.globalCollateral)))}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                ETH Collateral
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
                  minimumFractionDigits: 0
                }).format(Number(formatNumber(context.globalDebt, 0, true)))}
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                Minted RAI Debt
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
                  context.globalCollateral,
                  context.globalDebt,
                  context.liquidationPrice,
                  context.liquidationCRatio
                )}
                %
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
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
                {Number(
                  formatNumber(context.raiRedemptionPrice)
                ).toLocaleString('en-US')}{' '}
                USD
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                RAI Redemption Price
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
                  minimumFractionDigits: 3
                }).format(Number((context.raiRedemptionRate - 1) * 100))}{' '}
                %
              </Text>
              <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight='bold'>
                RAI Redemption Rate APY
              </Text>
            </Flex>
            <Flex
              direction='row'
              mr={{ lg: '2rem', sm: 0 }}
              alignItems='center'
              justifyContent='flex-start'
            >
              <FaExternalLinkSquareAlt />
              <ChakraLink
                textDecoration='underline'
                wordBreak='break-word'
                mr='1rem'
                cursor='pointer'
                _hover={{ opacity: 0.7 }}
                fontSize={{ lg: '18px', sm: '14px' }}
                href='https://stats.reflexer.finance/'
                isExternal
                ml='10px'
              >
                Click for more stats..
              </ChakraLink>
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
