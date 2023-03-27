import React, { useState } from 'react';
import {
  Box,
  Flex,
  ListItem,
  Avatar,
  Text,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { Message } from '@/models/types/message_contents';
import Form from './ui/Form';
import formatAgo from '@/utils/date';
import { AuthUserProps } from '@/models/types/auth_user';
import axios from 'axios';
import { ReplyProps } from '@/models/message/message.model';

interface MessageItemProps {
  item: Message;
  userInfo: AuthUserProps;
  isOwner: boolean;
  onSubmitComplete: () => void;
}

export default function MessageItem({
  item,
  isOwner,
  userInfo,
  onSubmitComplete,
}: MessageItemProps) {
  const toast = useToast();
  const [newReply, setNewReply] = useState<string>('');
  const { author, createdAt, id, message, repliedAt, reply } = item;

  const addReplyToMessage = async ({ uid, reply, messageId }: ReplyProps) => {
    try {
      const res = await axios({
        method: 'POST',
        url: '/api/message-add-reply',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          uid,
          reply,
          messageId,
        },
      });
      if (res.status === 201) {
        toast({
          title: '등록 성공',
          isClosable: true,
          duration: 7000,
          status: 'success',
          position: 'bottom-right',
        });
        onSubmitComplete();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: '등록 실패',
        description: '이미 댓글이 등록되었거나, 에러가 발생했습니다.',
        isClosable: true,
        status: 'error',
        duration: 7000,
        position: 'bottom-right',
      });
    }
  };

  return (
    <ListItem key={id} bgColor="white" rounded="md" p="2" my="2" boxShadow="md">
      <Flex align="center" gap="1">
        <Avatar
          src={
            author
              ? author?.photoURL ?? 'https://bit.ly/broken-link'
              : 'https://bit.ly/broken-link'
          }
          size="xs"
        />
        <Text fontSize="sm" fontWeight="semibold">
          {author?.displayName ?? 'Anonymous'}
        </Text>
        <Text fontSize="xx-small" color="gray.500">
          {formatAgo(createdAt, 'ko')}
        </Text>
      </Flex>
      <Box border="1px" borderColor="gray.200" rounded="md" p="2" my="1">
        <Text whiteSpace="pre-line" fontSize="sm">
          {message}
        </Text>
      </Box>
      <Box>
        {reply && (
          <>
            <Divider my="2" />
            <Flex justify="space-between">
              <Avatar
                src={userInfo?.photoURL ?? 'https://bit.ly/broken-link'}
                size="xs"
                mr="1"
              />
              <Box rounded="md" bgColor="gray.100" width="full" p="1">
                <Flex align="center">
                  <Text fontSize="xs" mr="1">
                    {userInfo?.displayName ?? ''}
                  </Text>
                  <Text fontSize="xs" color="gray" whiteSpace="pre-line">
                    {formatAgo(repliedAt!, 'ko')}
                  </Text>
                </Flex>
                <Text whiteSpace="pre-line" fontSize="xs">
                  {reply}
                </Text>
              </Box>
            </Flex>
          </>
        )}

        {!reply && isOwner && (
          <>
            <Divider my="2" />
            <Form
              buttonTitle="등록"
              placeholder="댓글을 입력하세요."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              onClick={() =>
                addReplyToMessage({
                  uid: userInfo.uid,
                  reply: newReply,
                  messageId: id,
                })
              }
              Avatar={
                <Avatar
                  size="xs"
                  src={userInfo?.photoURL ?? 'https://bit.ly/broken-link'}
                />
              }
            />
          </>
        )}
      </Box>
    </ListItem>
  );
}
