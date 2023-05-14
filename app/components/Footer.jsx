'use client';

import { Flex, Image as ChakraImage } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Flex direction='row' bg='rgb(5, 25, 46)' py='2rem' px='4rem'>
      <ChakraImage src='/brand-white.png' alt='Reflexer Finance' w='100px' />
    </Flex>
  );
};
