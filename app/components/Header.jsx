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
      direction={{ lg: 'row', sm: 'column' }}
      alignItems='center'
      justifyContent='space-between'
      mb='2rem'
    >
      <ChakraImage
        src='/brand-color.webp'
        alt='Reflexer Finance'
        w={{ lg: '200px', sm: '100px' }}
        cursor='pointer'
        onClick={() => router.push('/')}
      />
      <HStack mt={{ lg: 0, sm: '2rem' }}>
        <Input
          onChange={(e) => setSafeId(e.target.value)}
          placeholder='safe id'
        />
        <Button onClick={() => router.push(`/safe/${safeId}`)}>Search</Button>
      </HStack>
    </Flex>
  );
};
