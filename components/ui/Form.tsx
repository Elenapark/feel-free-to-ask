import { Flex, Textarea } from '@chakra-ui/react';
import React, { ChangeEvent, ReactNode } from 'react';
import CustomButton from './CustomButton';
import ResizeTextArea from 'react-textarea-autosize';

interface FormProps {
  Avatar?: ReactNode;
  placeholder?: string;
  buttonTitle?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onClick: () => void;
}

export default function Form({
  Avatar,
  placeholder = '내용을 입력하세요.',
  buttonTitle = '등록',
  value,
  onChange,
  onClick,
}: FormProps) {
  return (
    <Flex justify="space-between" align="center" gap="2">
      {Avatar}
      <Textarea
        placeholder={placeholder}
        bg="gray.100"
        border="none"
        resize="none"
        minH="unset"
        value={value}
        onChange={onChange}
        as={ResizeTextArea}
        maxRows={7}
      />
      <CustomButton
        title={buttonTitle}
        bgColor="#ffb86c"
        color="white"
        colorScheme="yellow"
        variant="solid"
        size="sm"
        isDisabled={value.length === 0}
        onClick={onClick}
      />
    </Flex>
  );
}
