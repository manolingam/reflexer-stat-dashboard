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
  calculateLTVRatio
} from '@/app/utils/helpers';
import { useState, useEffect } from 'react';

export default function SafePage({ params }) {
  const { data: safeData } = useQuery(SAFE_QUERY, {
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
      setSafe(safeData.safe);
    }
  }, [safeData]);

  return (
    <Flex direction='column'>
      <Flex direction='column' mb='2rem' p='1rem'>
        <HStack fontSize='36px' mb='10px'>
          <Button onClick={() => router.back()}>
            <GrPrevious />
          </Button>
          {!safe ? (
            <Skeleton w='200px' h='16px' />
          ) : (
            <Text># {safe.safeId}</Text>
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
          <SimpleGrid columns='3' gap='10' mb='2rem'>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Collateral</Text>
              {!safe ? (
                <Skeleton w='100px' h='30px' />
              ) : (
                <HStack alignItems='baseline'>
                  <Text fontSize='24px'>{formatNumber(safe.collateral)}</Text>
                  <Text fontSize='14px' opacity='0.7'>
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
                  <Text fontSize='24px'>{formatNumber(safe.debt)}</Text>
                  <Text fontSize='14px' opacity='0.7'>
                    DAI
                  </Text>
                </HStack>
              )}
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Ratio</Text>
              {!safe ? (
                <Skeleton w='100px' h='30px' />
              ) : (
                <Text fontSize='24px'>
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
          </SimpleGrid>

          <SimpleGrid columns='2' gap='5'>
            <VStack alignItems='flex-start'>
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
          </SimpleGrid>
        </Flex>
      </Flex>

      <SafeTable safeId={params.safeId} />
    </Flex>
  );
}
