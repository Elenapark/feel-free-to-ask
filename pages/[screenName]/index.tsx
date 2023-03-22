import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import CustomButton from '@/components/ui/CustomButton';
import { AuthUserProps } from '@/models/types/auth_user';
import {
  Avatar,
  Box,
  Flex,
  Text,
  Textarea,
  Switch,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ResizeTextArea from 'react-textarea-autosize';
import { useAuth } from '@/contexts/auth_user.context';

export default function UserHomePage() {
  const [user, setUser] = useState<AuthUserProps | null>(null);
  const [contents, setContents] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const authState = useAuth();

  const toast = useToast();

  const router = useRouter();
  const { screenName } = router.query;

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`/api/member-info/${screenName}`);
      const json = await res.json();
      setUser(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [screenName]);

  return (
    <Layout title="User Home" minH="100vh" backgroundColor="gray.100">
      <Box maxW="md" mx="auto" pt="6" px="2">
        <Flex align="center" bgColor="white" rounded="md" p="4">
          <Avatar src={user?.photoURL!} size="lg" mr="2" />
          <Box>
            <Text fontSize="md">{user?.displayName}</Text>
            <Text fontSize="xs">@{user?.email?.split('@')[0]}</Text>
          </Box>
        </Flex>
        <Flex
          flexDirection="column"
          bgColor="white"
          rounded="md"
          p="2"
          my="2"
          gap="2"
        >
          <Flex justify="space-between" align="center" gap="2">
            {isAnonymous && (
              <Avatar size="xs" src={'https://bit.ly/broken-link'} />
            )}
            {!isAnonymous && (
              <Avatar
                size="xs"
                src={
                  authState?.authUser?.photoURL ?? 'https://bit.ly/broken-link'
                }
              />
            )}
            <Textarea
              placeholder="여기에 입력하세요"
              bg="gray.100"
              border="none"
              resize="none"
              minH="unset"
              value={contents}
              onChange={(e) => {
                if (e.currentTarget.value) {
                  const lineCount =
                    e.currentTarget.value.match(/[^\n]*\n[^\n]*/gi)?.length ??
                    1;
                  if (lineCount >= 7) {
                    toast({
                      title: '최대 7줄까지만 입력 가능합니다.',
                      status: 'error',
                      duration: 7000,
                      position: 'bottom-right',
                      isClosable: true,
                    });
                    return;
                  }
                  setContents(e.currentTarget.value);
                }
              }}
              as={ResizeTextArea}
              maxRows={7}
            />
            <CustomButton
              title="등록"
              bgColor="#ffb86c"
              color="white"
              colorScheme="yellow"
              variant="solid"
              size="sm"
              isDisabled={contents.length === 0}
              onClick={() => console.log(contents)}
            />
          </Flex>
          <FormControl display="flex" alignItems="center">
            <Switch
              id="anonymous"
              size="sm"
              mr={1}
              colorScheme="orange"
              isChecked={isAnonymous}
              onChange={(e) => {
                if (!authState?.authUser) {
                  toast({
                    title: '로그인이 필요합니다.',
                    status: 'info',
                    isClosable: true,
                    duration: 7000,
                    position: 'bottom-right',
                  });
                  return;
                }
                setIsAnonymous(e.currentTarget.checked);
              }}
            />
            <FormLabel htmlFor="anonymous" mb="0" fontSize="small">
              익명으로 작성하기
            </FormLabel>
          </FormControl>
        </Flex>
      </Box>
    </Layout>
  );
}
