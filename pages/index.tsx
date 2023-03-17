import Layout from '@/components/Layout';
import Image from 'next/image';
import { Box, Heading, Flex, Center } from '@chakra-ui/react';
import CustomButton from '@/components/ui/CustomButton';
import { useAuth } from '@/contexts/auth_user.context';

export default function Home() {
  const { authUser, signInWithGoogle, signOutWithGoogle } = useAuth();

  return (
    <>
      <Layout>
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
              Write down your favorite sentences
            </Heading>
            <Center w="300px" my="20px">
              <CustomButton
                title={authUser ? 'Logout' : 'Login With Google'}
                size="md"
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
            </Center>
          </Flex>
        </Box>
      </Layout>
    </>
  );
}
