import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from 'next';
import { Layout } from '@/components/Layout';
import { AuthUserProps } from '@/models/types/auth_user';
import { Box, List, Text } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth_user.context';
import UserProfile from '@/components/UserProfile';
import MessageItem from '@/components/MessageItem';
import { Message } from '@/models/types/message_contents';
import MemberModel from '@/models/member/member.model';
import MessageModel from '@/models/message/message.model';
import { getSingleMessage } from '@/services/message-api';
import { useQuery } from '@tanstack/react-query';
import InfoMessage from '@/components/InfoMessage';

interface Props {
  userInfo: AuthUserProps | null;
  messageItem: Message | null;
}

const MessageDetail: NextPage<Props> = ({
  userInfo,
  messageItem: initMessageItem,
}) => {
  const [messageItem, setMessageItem] = useState<Message | null>(
    initMessageItem
  );
  const authState = useAuth();

  const { isLoading, isError } = useQuery({
    queryKey: ['MessageList', userInfo?.uid, messageItem?.id],
    queryFn: () =>
      getSingleMessage({ uid: userInfo?.uid!, messageId: messageItem?.id! }),
    enabled: !!userInfo?.uid && !!messageItem?.id,
    onSuccess: (res) => {
      setMessageItem(res.data);
    },
    refetchOnWindowFocus: false,
  });

  if (!userInfo) return <Text fontSize="md">사용자 정보가 없습니다.</Text>;
  if (!messageItem) return <Text fontSize="md">메세지 정보가 없습니다.</Text>;

  const isOwner =
    authState?.authUser !== null && authState?.authUser?.uid === userInfo?.uid;

  return (
    <Layout
      title={`${userInfo.displayName}님의 공간입니다.🌟`}
      minH="100vh"
      backgroundColor="gray.100"
    >
      <Box maxW="md" mx="auto" py="6" px="2">
        <UserProfile userInfo={userInfo} />
        {isLoading ? (
          <InfoMessage>
            <Text>로딩중입니다...</Text>
          </InfoMessage>
        ) : isError ? (
          <InfoMessage>
            <Text>에러가 발생했습니다.</Text>
          </InfoMessage>
        ) : (
          <List>
            <MessageItem
              item={messageItem}
              userInfo={userInfo}
              isOwner={isOwner}
            />
          </List>
        )}
      </Box>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}): Promise<GetServerSidePropsResult<Props>> => {
  // 사용자가 url을 직접 입력하여 들어오는 경우
  const { screenName, messageId } = query as {
    screenName: string;
    messageId: string;
  };

  if (!screenName || !messageId) {
    return {
      props: {
        userInfo: null,
        messageItem: null,
      },
    };
  }

  try {
    const userInfo = await MemberModel.getInfoByScreenName(screenName);
    if (!userInfo?.uid) {
      throw new Error('uid가 없습니다.');
    }

    const messageItem = await MessageModel.getEachMessage({
      uid: userInfo.uid,
      messageId,
    });

    if (!messageItem) {
      throw new Error('message Item이 없습니다.');
    }

    return {
      props: {
        userInfo: userInfo ?? null,
        messageItem: messageItem ?? null,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        userInfo: null,
        messageItem: null,
      },
    };
  }
};

export default MessageDetail;
