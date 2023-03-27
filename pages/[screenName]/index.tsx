import { ChangeEvent, useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { AuthUserProps } from '@/models/types/auth_user';
import { Box, Text, useToast } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth_user.context';
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from 'next';
import axios from 'axios';
import { AddMessageProps, ReplyProps } from '@/models/message/message.model';
import Messages from '@/components/Messages';
import UserProfile from '@/components/UserProfile';
import MessageForm from '@/components/MessageForm';
import { Message } from '@/models/types/message_contents';
interface Props {
  userInfo: AuthUserProps | null;
}

const UserHomePage: NextPage<Props> = ({ userInfo }) => {
  const [contents, setContents] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [messageList, setMessageList] = useState<Message[]>([]);

  const authState = useAuth();
  const toast = useToast();

  const fetchPostRequest = async ({
    uid,
    message,
    author,
  }: AddMessageProps) => {
    if (message.length === 0) {
      return {
        result: false,
        message: '입력값이 등록되지 않았습니다.',
      };
    }
    try {
      await axios({
        method: 'POST',
        url: '/api/message-add',
        data: {
          uid,
          message,
          author,
        },
      });
      setContents('');
      return {
        result: true,
        message: '입력값이 성공적으로 등록되었습니다.',
      };
    } catch (err) {
      console.error(err);
      return {
        result: false,
        message: '입력값 등록에 실패했습니다.',
      };
    }
  };

  const handleRegisterContents = async () => {
    const author = isAnonymous
      ? undefined
      : {
          displayName: authState?.authUser?.displayName ?? 'Anonymous',
          photoURL:
            authState?.authUser?.photoURL ?? 'https://bit.ly/broken-link',
        };
    const res = await fetchPostRequest({
      uid: userInfo!.uid,
      message: contents,
      author,
    });
    if (!res?.result) {
      toast({
        title: '등록 실패',
        description: '컨텐츠가 입력되지 않았거나, 에러가 발생했습니다.',
        isClosable: true,
        status: 'error',
        duration: 7000,
        position: 'bottom-right',
      });
      return;
    }
    toast({
      title: '등록 성공',
      isClosable: true,
      duration: 7000,
      status: 'success',
      position: 'bottom-right',
    });
    getMessageList(userInfo!.uid);
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

  // get single message
  const getSingleMessage = async ({
    uid,
    messageId,
  }: Omit<ReplyProps, 'reply'>) => {
    try {
      const res = await axios(
        `/api/message-each?uid=${uid}&messageId=${messageId}`
      );
      if (res.status === 200) {
        setMessageList((prev) =>
          prev.map((item) => (item.id === messageId ? res.data : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // get all messages list
  const getMessageList = async (uid: string) => {
    try {
      const res = await fetch(`/api/message-list?uid=${uid}`);
      const data = await res.json();
      setMessageList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    getMessageList(userInfo.uid);
  }, [userInfo]);

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
        <Messages
          messageList={messageList}
          userInfo={userInfo}
          onSubmitComplete={getSingleMessage}
        />
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
