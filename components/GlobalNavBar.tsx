import { useAuth } from '@/contexts/auth_user.context';
import { Box, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import CustomButton from './ui/CustomButton';

export default function GlobalNavBar() {
  const { authUser, signInWithGoogle, signOutWithGoogle } = useAuth();
  return (
    <Flex
      w="full"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      borderBottomWidth={1}
      backgroundColor="white"
      boxShadow="sm"
    >
      <Image src="/header_logo.png" alt="header logo" width={60} height={30} />
      <CustomButton
        title={authUser ? 'Logout' : 'Login With Google'}
        w="auto"
        size="sm"
        bgColor="#4285f4"
        color="#fff"
        colorScheme="blue"
        leftIcon={
          <Image src="/google.svg" alt="google logo" width={15} height={15} />
        }
        onClick={authUser ? signOutWithGoogle : signInWithGoogle}
      />
    </Flex>
  );
}
