import { Box, Button } from '@chakra-ui/react';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps {
  title: string;
  onClick: () => void;
  [x: string]: any;
}

export default function CustomButton({
  title,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <Box w="full">
      <Button w="full" {...props} onClick={onClick}>
        {title}
      </Button>
    </Box>
  );
}
