import { AuthContextProps, useAuth } from '@/contexts/auth_user.context';
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import CustomButton from './ui/CustomButton';

export default function GlobalNavBar() {
  const router = useRouter();
  const { authUser, signInWithGoogle, signOutWithGoogle } =
    useAuth() as AuthContextProps;

  return (
    <Box borderBottomWidth={1} boxShadow="sm" backgroundColor="white">
      <Flex
        maxW="6xl"
        mx="auto"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        backgroundColor="white"
      >
        <Box cursor="pointer">
          <Image
            src="/header_logo.png"
            alt="header logo"
            width={60}
            height={30}
            onClick={() => router.push('/')}
          />
        </Box>
        <Box>
          {authUser && (
            <Menu>
              <MenuButton
                backgroundColor="transparent"
                as={IconButton}
                icon={
                  <Avatar
                    src={authUser?.photoURL ?? 'https://bit.ly/broken-link'}
                    size="sm"
                  />
                }
              />
              <MenuList>
                <MenuItem
                  onClick={() => {
                    router.push(`/${authUser?.email?.split('@')[0]}`);
                  }}
                >
                  사용자 홈으로 이동
                </MenuItem>
                <MenuItem onClick={signOutWithGoogle}>로그아웃</MenuItem>
              </MenuList>
            </Menu>
          )}
          {!authUser && (
            <CustomButton
              title={authUser ? 'Logout' : 'Login'}
              w="auto"
              size="sm"
              bgColor="#4285f4"
              color="#fff"
              colorScheme="blue"
              leftIcon={
                <Image
                  src="/google.svg"
                  alt="google logo"
                  width={15}
                  height={15}
                />
              }
              onClick={authUser ? signOutWithGoogle : signInWithGoogle}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
}
