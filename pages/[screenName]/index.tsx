import { ChangeEvent, useState } from 'react';
import { Layout } from '@/components/Layout';
import { AuthUserProps } from '@/models/types/auth_user';
import { Box, Text, useToast } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth_user.context';
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from 'next';
import axios from 'axios';
import { AddMessageProps } from '@/models/message/message.model';
import Messages from '@/components/Messages';
import UserProfile from '@/components/UserProfile';
import MessageForm from '@/components/MessageForm';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMessage, getAllMessages } from '@/services/message-api';
import InfoMessage from '@/components/InfoMessage';
interface Props {
  userInfo: AuthUserProps | null;
}

const UserHomePage: NextPage<Props> = ({ userInfo }) => {
  const [contents, setContents] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);

  const authState = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate: addMutate } = useMutation({
    mutationFn: ({ uid, message, author }: AddMessageProps) =>
      addMessage({ uid, message, author }),
    onSuccess: (res) => {
      if (res.status === 201) {
        toast({
          title: '등록 성공',
          isClosable: true,
          duration: 7000,
          status: 'success',
          position: 'bottom-right',
        });
        queryClient.invalidateQueries(['MessageList', userInfo?.uid]);
      }
    },
    onError: () => {
      toast({
        title: '등록 실패',
        description: '컨텐츠가 입력되지 않았거나, 에러가 발생했습니다.',
        isClosable: true,
        status: 'error',
        duration: 7000,
        position: 'bottom-right',
      });
    },
  });

  const handleRegisterContents = () => {
    const author = isAnonymous
      ? undefined
      : {
          displayName: authState?.authUser?.displayName ?? 'Anonymous',
          photoURL:
            authState?.authUser?.photoURL ?? 'https://bit.ly/broken-link',
        };
    addMutate({
      uid: userInfo!.uid,
      message: contents,
      author,
    });
  };

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

  const {
    data: messageList,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['MessageList', userInfo?.uid],
    queryFn: () => getAllMessages(userInfo!.uid),
    enabled: !!userInfo?.uid,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
  if (!userInfo) return <Text fontSize="md">사용자 정보가 없습니다.</Text>;

  return (
    <Layout
      title={`${userInfo.displayName}님의 공간입니다.🌟`}
      minH="100vh"
      backgroundColor="gray.100"
    >
      <Box maxW="md" mx="auto" py="6" px="2">
        <UserProfile userInfo={userInfo} />
        <MessageForm
          isAnonymous={isAnonymous}
          contents={contents}
          handleContentsChange={handleContentsChange}
          handleRegisterContents={handleRegisterContents}
          handleSwitchChange={handleSwitchChange}
        />
        {isLoading ? (
          <InfoMessage>
            <Text>로딩중입니다. 조금만 더 기다려봐요! 🤔</Text>
          </InfoMessage>
        ) : isError ? (
          <InfoMessage>
            <Text>에러가 발생했습니다.🥲</Text>
          </InfoMessage>
        ) : (
          <Messages messageList={messageList} userInfo={userInfo} />
        )}
      </Box>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}): Promise<GetServerSidePropsResult<Props>> => {
  // 사용자가 url을 직접 입력하여 들어오는 경우
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
