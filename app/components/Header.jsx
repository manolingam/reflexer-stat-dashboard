'use client';

import {
  Flex,
  Image as ChakraImage,
  Input,
  Button,
  HStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const [safeId, setSafeId] = useState('');
  const router = useRouter();

  return (
    <Flex
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      mb='2rem'
    >
      <ChakraImage src='/brand-color.webp' alt='Reflexer Finance' w='200px' />
      <HStack>
        <Input
          onChange={(e) => setSafeId(e.target.value)}
          placeholder='safe id'
        />
        <Button onClick={() => router.push(`/safe/${safeId}`)}>Search</Button>
      </HStack>
    </Flex>
  );
};
