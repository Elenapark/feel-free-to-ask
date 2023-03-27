import { Box, Flex, List } from '@chakra-ui/react';
import MessageItem from './MessageItem';
import { Message } from '@/models/types/message_contents';
import { AuthUserProps } from '@/models/types/auth_user';
import { useAuth } from '@/contexts/auth_user.context';

const Messages = ({
  messageList,
  userInfo,
  onSubmitComplete,
}: {
  messageList: Message[];
  userInfo: AuthUserProps;
  onSubmitComplete: () => void;
}) => {
  const authState = useAuth();
  const isOwner =
    authState?.authUser !== null && authState?.authUser?.uid === userInfo?.uid;

  if (messageList.length === 0) {
    return (
      <Box my="4">
        <Flex
          bgColor="white"
          rounded="md"
          p="2"
          my="2"
          minH="200px"
          justify="center"
          alignItems="center"
          fontWeight="bold"
        >
          등록된 메세지가 아직 없어요. 조금만 더 기다려봐요! 🤔
        </Flex>
      </Box>
    );
  }
  return (
    <List my="4">
      {messageList?.map((item: Message) => {
        return (
          <MessageItem
            key={item.id}
            item={item}
            userInfo={userInfo}
            isOwner={isOwner}
            onSubmitComplete={onSubmitComplete}
          />
        );
      })}
    </List>
  );
};

export default Messages;
