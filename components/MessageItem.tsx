import { useState } from 'react';
import {
  Box,
  Flex,
  ListItem,
  Avatar,
  Text,
  Divider,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { Message } from '@/models/types/message_contents';
import Form from './ui/Form';
import { BsThreeDots } from 'react-icons/bs';

import formatAgo from '@/utils/date';
import { AuthUserProps } from '@/models/types/auth_user';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReplyProps } from '@/models/message/message.model';
import {
  addReplyToMessage,
  MessageProps,
  updateMessage,
} from '@/services/message-api';
import { useRouter } from 'next/router';

interface MessageItemProps {
  item: Message;
  userInfo: AuthUserProps;
  isOwner: boolean;
}

export default function MessageItem({
  item,
  isOwner,
  userInfo,
}: MessageItemProps) {
  const router = useRouter();
  const toast = useToast();
  const [newReply, setNewReply] = useState<string>('');
  const { author, createdAt, id, message, repliedAt, reply } = item;
  const queryClient = useQueryClient();

  const { mutate: addReplyMutate } = useMutation({
    mutationFn: ({ uid, reply, messageId }: ReplyProps) =>
      addReplyToMessage({ uid, reply, messageId }),
    onSuccess: (data) => {
      if (data.status === 200) {
        toast({
          title: '등록 성공',
          isClosable: true,
          duration: 7000,
          status: 'success',
          position: 'bottom-right',
        });
        queryClient.setQueryData(
          ['MessageList', userInfo?.uid, item.id],
          data.data
        );
        queryClient.invalidateQueries(['MessageList', userInfo?.uid]);
      }
    },
    onError: () => {
      toast({
        title: '등록 실패',
        description: '이미 댓글이 등록되었거나, 에러가 발생했습니다.',
        isClosable: true,
        status: 'error',
        duration: 7000,
        position: 'bottom-right',
      });
    },
  });

  const { mutate: updateMessageMutate } = useMutation({
    mutationFn: ({
      uid,
      messageId,
      isDenied,
    }: MessageProps & { isDenied: boolean }) =>
      updateMessage({ uid, messageId, isDenied }),
    onSuccess: () => {
      toast({
        title: '메세지 상태가 변경되었습니다.',
        isClosable: true,
        status: 'success',
        duration: 3000,
        position: 'bottom-right',
      });
      queryClient.invalidateQueries(['MessageList', userInfo?.uid]);
    },
    onError: () => {
      toast({
        title: '메세지 상태 변경에 실패했습니다.',
        isClosable: true,
        status: 'error',
        duration: 3000,
        position: 'bottom-right',
      });
    },
  });

  const isDeniedTitle =
    item.isDenied !== undefined ? item.isDenied === true : false;

  return (
    <ListItem key={id} bgColor="white" rounded="md" p="2" my="2" boxShadow="md">
      <Flex justify="space-between" align="center" gap="1">
        <Flex gap="1" align="center">
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
        {isOwner && (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BsThreeDots />}
              bgColor="transparent"
            />
            <MenuList>
              <MenuItem
                onClick={() =>
                  updateMessageMutate({
                    uid: userInfo.uid,
                    messageId: item.id,
                    isDenied:
                      item.isDenied !== undefined ? !item.isDenied : true,
                  })
                }
              >
                {isDeniedTitle ? '비공개 처리 해제' : '비공개 처리'}
              </MenuItem>
              <MenuItem
                onClick={() =>
                  router.push(`/${userInfo.email?.split('@')[0]}/${item.id}`)
                }
              >
                메세지 상세 보기
              </MenuItem>
            </MenuList>
          </Menu>
        )}
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
                  <Text fontSize="xx-small" color="gray" whiteSpace="pre-line">
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
                addReplyMutate({
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
