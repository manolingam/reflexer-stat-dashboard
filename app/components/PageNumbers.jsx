'use client';

import { Flex, Text, Button } from '@chakra-ui/react';
import { GrPrevious, GrNext } from 'react-icons/gr';

export const PageNumbers = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <Flex
      w='100%'
      direction='row'
      alignItems='center'
      justifyContent='end'
      mt='1rem'
    >
      <Button
        isDisabled={currentPage + 1 <= 1}
        onClick={() => setCurrentPage((currentPage) => currentPage - 1)}
        fontSize='10px'
        padding='10px'
        height='auto'
      >
        <GrPrevious />
      </Button>
      {totalPages > 0 && (
        <Text mx='14px' fontSize='12px' opacity='0.7' textTransform='uppercase'>
          Page {currentPage + 1} of {totalPages}
        </Text>
      )}
      <Button
        isDisabled={currentPage + 1 >= totalPages}
        onClick={() => setCurrentPage((currentPage) => currentPage + 1)}
        fontSize='10px'
        padding='10px'
        height='auto'
      >
        <GrNext />
      </Button>
    </Flex>
  );
};
