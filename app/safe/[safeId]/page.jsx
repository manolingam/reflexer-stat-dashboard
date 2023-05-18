'use client';

import { SafeTable } from '@/app/components/SafeTable';
import {
  Flex,
  Text,
  SimpleGrid,
  Skeleton,
  VStack,
  Button,
  Tag,
  HStack
} from '@chakra-ui/react';
import { GrPrevious } from 'react-icons/gr';
import { SAFE_QUERY, RAIPRICE_QUERY } from '@/app/utils/queries';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import {
  getAccountString,
  formatNumber,
  calculateLTVRatio,
  collateralRatio
} from '@/app/utils/helpers';
import { useState, useEffect } from 'react';

export default function SafePage({ params }) {
  const { data: safeData, error } = useQuery(SAFE_QUERY, {
    variables: { id: params.safeId }
  });

  const { data: raiPriceData } = useQuery(RAIPRICE_QUERY);

  const [raiPrice, setRaiPrice] = useState(1);
  const [safe, setSafe] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (raiPriceData) {
      setRaiPrice(raiPriceData.dailyStats[0].marketPriceUsd);
    }
  }, [raiPriceData]);

  useEffect(() => {
    if (safeData) {
      setSafe(safeData.safes[0]);
    }
  }, [safeData]);

  return (
    <Flex direction='column'>
      <Flex direction='column' mb='2rem' p='1rem'>
        <HStack fontSize={{ lg: '36px', sm: '24px' }} mb='10px'>
          <Button
            background='#3ac1b9'
            color='black'
            fontWeight='light'
            _hover={{ opacity: 0.7 }}
            onClick={() => router.back()}
            mr='1rem'
          >
            <GrPrevious />
          </Button>
          {!safe ? (
            <Skeleton w='200px' h='16px' />
          ) : (
            <Text
              background='linear-gradient(to right, #41c1d0, #1a6c51)'
              backgroundClip='text'
              fontWeight='extrabold'
            >
              # {safe.safeId}
            </Text>
          )}
        </HStack>
        {!safe ? (
          <Skeleton w='200px' h='16px' />
        ) : (
          <HStack>
            <Text fontSize='12px'>Owned by</Text>
            <Tag w='auto'>{getAccountString(safe.owner.address)}</Tag>{' '}
          </HStack>
        )}
      </Flex>

      <Flex direction='row' p='1rem' mb='3rem'>
        <Flex direction='column'>
          <SimpleGrid columns={{ lg: 4, sm: 2 }} gap='10' mb='2rem'>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Collateral</Text>
              {!safe ? (
                <Skeleton w='100px' h='30px' />
              ) : (
                <HStack alignItems='baseline'>
                  <Text
                    background='linear-gradient(to right, #41c1d0, #1a6c51)'
                    backgroundClip='text'
                    fontWeight='extrabold'
                    fontSize={{ lg: '32px', sm: '18px' }}
                  >
                    {formatNumber(safe.collateral)}
                  </Text>
                  <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                    ETH
                  </Text>
                </HStack>
              )}
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Debt</Text>
              {!safe ? (
                <Skeleton w='100px' h='30px' />
              ) : (
                <HStack alignItems='baseline'>
                  <Text
                    background='linear-gradient(to right, #41c1d0, #1a6c51)'
                    backgroundClip='text'
                    fontWeight='extrabold'
                    fontSize={{ lg: '32px', sm: '18px' }}
                  >
                    {formatNumber(safe.debt)}
                  </Text>
                  <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                    RAI
                  </Text>
                </HStack>
              )}
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'> LTV Ratio</Text>
              {!safe ? (
                <Skeleton w='100px' h='30px' />
              ) : (
                <Text
                  fontSize={{ lg: '32px', sm: '18px' }}
                  background='linear-gradient(to right, #41c1d0, #1a6c51)'
                  backgroundClip='text'
                  fontWeight='extrabold'
                >
                  {calculateLTVRatio(
                    safe.collateral,
                    safe.collateralType.currentPrice.value,
                    safe.debt,
                    raiPrice
                  )}
                  %
                </Text>
              )}
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'> Collateral Ratio</Text>
              {!safe ? (
                <Skeleton w='100px' h='30px' />
              ) : (
                <Text
                  fontSize={{ lg: '32px', sm: '18px' }}
                  background='linear-gradient(to right, #41c1d0, #1a6c51)'
                  backgroundClip='text'
                  fontWeight='extrabold'
                >
                  {collateralRatio(
                    safe.collateral,
                    safe.collateralType.currentPrice.value,
                    safe.debt,
                    raiPrice
                  )}
                  %
                </Text>
              )}
            </VStack>
          </SimpleGrid>

          <Flex direction='row'>
            <VStack alignItems='flex-start' mr='2rem'>
              <Text opacity='0.7'>Current Price</Text>
              {!safe ? (
                <Skeleton w='70px' h='10px' />
              ) : (
                <Text fontSize='18px'>
                  $ {formatNumber(safe.collateralType.currentPrice.value)}
                </Text>
              )}
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Liquidation Price</Text>
              {!safe ? (
                <Skeleton w='70px' h='10px' />
              ) : (
                <Text fontSize='18px'>
                  ${' '}
                  {formatNumber(
                    safe.collateralType.currentPrice.liquidationPrice
                  )}
                </Text>
              )}
            </VStack>
          </Flex>
        </Flex>
      </Flex>

      {safe && <SafeTable safeId={safe.id} />}
    </Flex>
  );
}
