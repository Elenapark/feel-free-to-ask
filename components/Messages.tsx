import { List } from '@chakra-ui/react';
import MessageItem from './MessageItem';
import { Message } from '@/models/types/message_contents';
import { AuthUserProps } from '@/models/types/auth_user';
import { useAuth } from '@/contexts/auth_user.context';

const Messages = ({
  messageList,
  userInfo,
}: {
  messageList: Message[];
  userInfo: AuthUserProps;
}) => {
  const authState = useAuth();
  const isOwner =
    authState?.authUser !== null && authState?.authUser?.uid === userInfo?.uid;

  return (
    <List my="4">
      {messageList?.map((item: Message) => {
        return (
          <MessageItem
            key={item.id}
            item={item}
            userInfo={userInfo}
            isOwner={isOwner}
          />
        );
      })}
    </List>
  );
};

export default Messages;
