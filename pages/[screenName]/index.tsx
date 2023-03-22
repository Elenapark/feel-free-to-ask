import { ChangeEvent, useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import CustomButton from '@/components/ui/CustomButton';
import { AuthUserProps } from '@/models/types/auth_user';
import { Avatar, Box, Flex, Text, Textarea, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ResizeTextArea from 'react-textarea-autosize';
import { useAuth } from '@/contexts/auth_user.context';
import CustomSwitch from '@/components/ui/CustomSwitch';
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from 'next';
import axios from 'axios';
interface Props {
  userInfo: AuthUserProps | null;
}

const UserHomePage: NextPage<Props> = ({ userInfo }) => {
  const [contents, setContents] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);

  const authState = useAuth();
  const toast = useToast();

  const handleContentsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.value) {
      const lineCount =
        e.currentTarget.value.match(/[^\n]*\n[^\n]*/gi)?.length ?? 1;
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
  };

  const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
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
  };

  if (!userInfo) return <Text fontSize="md">사용자 정보가 없습니다.</Text>;

  return (
    <Layout title="User Home" minH="100vh" backgroundColor="gray.100">
      <Box maxW="md" mx="auto" pt="6" px="2">
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
              placeholder="내용을 입력하세요"
              bg="gray.100"
              border="none"
              resize="none"
              minH="unset"
              value={contents}
              onChange={handleContentsChange}
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
          <CustomSwitch
            id="anonymous"
            size="sm"
            mr={1}
            colorScheme="orange"
            isChecked={isAnonymous}
            onChange={handleSwitchChange}
            FormLabelText="익명으로 작성하기"
          />
        </Flex>
      </Box>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}): Promise<GetServerSidePropsResult<Props>> => {
  const { screenName } = query;

  if (!screenName) {
    return {
      props: {
        userInfo: null,
      },
    };
  }

  try {
    // api call from server side
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseURL = `${protocol}://${host}:${port}`;
    const response = await axios(`${baseURL}/api/member-info/${screenName}`);

    return {
      props: {
        userInfo: response.data ?? null,
      },
    };
  } catch (err) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
};

export default UserHomePage;
