import { AuthUserProps } from '@/models/types/auth_user';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

export default function UserProfile({ userInfo }: { userInfo: AuthUserProps }) {
  return (
    <Flex align="center" bgColor="white" rounded="md" p="4">
      <Avatar
        src={userInfo?.photoURL ?? 'https://bit.ly/broken-link'}
        size="lg"
        mr="2"
      />
      <Box>
        <Text fontSize="md">{userInfo?.displayName}</Text>
        <Text fontSize="xs">@{userInfo?.email?.split('@')[0]}</Text>
      </Box>
    </Flex>
  );
}
