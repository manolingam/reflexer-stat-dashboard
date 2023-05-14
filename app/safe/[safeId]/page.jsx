'use client';

import { SafeTable } from '@/app/components/SafeTable';
import {
  Flex,
  Text,
  SimpleGrid,
  Skeleton,
  Image as ChakraImage,
  VStack,
  Highlight,
  Tag,
  HStack
} from '@chakra-ui/react';
import { FaEthereum } from 'react-icons/fa';

export default function SafePage({ params }) {
  console.log(params);
  return (
    <Flex direction='column'>
      <Flex direction='column' mb='2rem' p='1rem'>
        <HStack fontSize='36px' mb='10px'>
          <FaEthereum /> <Text>2334</Text>
        </HStack>

        <Tag w='200px'>Owned by 0xr...g4e5</Tag>
      </Flex>
      <Flex direction='row' p='1rem'>
        <Flex direction='column'>
          <SimpleGrid columns='3' gap='10' mb='2rem'>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Collateral</Text>
              <Text fontSize='24px'>
                <Highlight
                  query='ETH'
                  styles={{
                    fontSize: '14px',
                    opacity: 0.7
                  }}
                >
                  91,632 ETH
                </Highlight>
              </Text>
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Debt</Text>
              <Text fontSize='24px'>
                <Highlight
                  query='DAI'
                  styles={{
                    fontSize: '14px',
                    opacity: 0.7
                  }}
                >
                  57.2M DAI
                </Highlight>
              </Text>
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Ratio</Text>
              <Text fontSize='24px'>342.51%</Text>
            </VStack>
          </SimpleGrid>

          <SimpleGrid columns='2' gap='5'>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Current Price</Text>
              <Text fontSize='18px'>$2,139.57</Text>
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Liquidation Price</Text>
              <Text fontSize='18px'>$1,155.63</Text>
            </VStack>
          </SimpleGrid>
        </Flex>
      </Flex>

      <SafeTable safeId={params.safeId} />
    </Flex>
  );
}
