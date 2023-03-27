import { Box, Flex, List } from '@chakra-ui/react';
import MessageItem from './MessageItem';
import { MessageListProps } from '@/models/types/message_contents';

const Messages = ({ messageList }: { messageList: MessageListProps[] }) => {
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
      {messageList?.map((item: MessageListProps) => {
        return <MessageItem key={item.id} isOwner={false} item={item} />;
      })}
    </List>
  );
};

export default Messages;
