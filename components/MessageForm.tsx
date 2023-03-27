import { Avatar, Flex } from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import CustomSwitch from './ui/CustomSwitch';
import { useAuth } from '@/contexts/auth_user.context';
import Form from './ui/Form';

interface MessageFormProps {
  isAnonymous: boolean;
  contents: string;
  handleContentsChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleRegisterContents: () => void;
  handleSwitchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function MessageForm({
  isAnonymous,
  contents,
  handleContentsChange,
  handleRegisterContents,
  handleSwitchChange,
}: MessageFormProps) {
  const authState = useAuth();
  return (
    <Flex
      flexDirection="column"
      bgColor="white"
      rounded="md"
      p="2"
      my="2"
      gap="2"
    >
      <Form
        buttonTitle="등록"
        placeholder="메세지를 입력하세요."
        value={contents}
        onChange={handleContentsChange}
        onClick={handleRegisterContents}
        Avatar={
          <>
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
          </>
        }
      />
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
  );
}
