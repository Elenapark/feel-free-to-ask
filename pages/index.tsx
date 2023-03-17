import { Layout } from '@/components/Layout';
import Image from 'next/image';
import { Box, Heading, Flex, Center } from '@chakra-ui/react';
import CustomButton from '@/components/ui/CustomButton';
import { useAuth } from '@/contexts/auth_user.context';

export default function Home() {
  const { authUser, signInWithGoogle } = useAuth();

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
            Write down your favorite sentences
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
