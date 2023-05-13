'use client';

import { Flex, Text, Button } from '@chakra-ui/react';
import {
  BsFillArrowRightSquareFill,
  BsFillArrowLeftSquareFill
} from 'react-icons/bs';

export const PageNumbers = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <Flex
      w='100%'
      direction='row'
      alignItems='center'
      justifyContent='end'
      mt='10px'
    >
      <Button
        isDisabled={currentPage + 1 <= 1}
        onClick={() => setCurrentPage((currentPage) => currentPage - 1)}
        padding='10px'
        height='auto'
      >
        <BsFillArrowLeftSquareFill />
      </Button>
      {totalPages > 0 && (
        <Text mx='14px'>
          Page {currentPage + 1} of {totalPages}
        </Text>
      )}
      <Button
        isDisabled={currentPage + 1 >= totalPages}
        onClick={() => setCurrentPage((currentPage) => currentPage + 1)}
        padding='10px'
        height='auto'
      >
        <BsFillArrowRightSquareFill />
      </Button>
    </Flex>
  );
};
