'use client';

import { Flex, Image as ChakraImage } from '@chakra-ui/react';

export const Header = () => {
  return (
    <Flex mb='2rem'>
      <ChakraImage src='/brand-color.webp' alt='Reflexer Finance' w='200px' />
    </Flex>
  );
};
