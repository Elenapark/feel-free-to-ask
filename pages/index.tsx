import { Layout } from '@/components/Layout';
import Image from 'next/image';
import { Box, Heading, Flex, Center } from '@chakra-ui/react';
import CustomButton from '@/components/ui/CustomButton';
import { AuthContextProps, useAuth } from '@/contexts/auth_user.context';

export default function Home() {
  const { authUser, signInWithGoogle } = useAuth() as AuthContextProps;

  return (
    <Layout minH="100vh">
      <Box maxW="lg" m="40px auto">
        <Flex justify="center" direction="column" align="center">
          <Image
            src="/main_logo.png"
            alt="main logo"
            width={300}
            height={300}
            style={{ objectFit: 'cover', textAlign: 'center' }}
          />

          <Heading as="h2" size="md" my={2}>
            무엇이든 물어보세요 🌟
          </Heading>
          {!authUser && (
            <Center w="300px" my="20px">
              <CustomButton
                title="Login With Google"
                size="md"
                w="full"
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
                onClick={signInWithGoogle}
              />
            </Center>
          )}
        </Flex>
      </Box>
    </Layout>
  );
}
