import { Box, Flex } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

export default function InfoMessage({ children }: { children: ReactNode }) {
  return (
    <Box my="4">
      <Flex
        bgColor="white"
        rounded="md"
        p="2"
        my="2"
        minH="200px"
        justify="center"
        alignItems="center"
        fontWeight="bold"
      >
        {children}
      </Flex>
    </Box>
  );
}
