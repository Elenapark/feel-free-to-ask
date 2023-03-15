import { Box, Button } from '@chakra-ui/react';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps {
  title: string;
  [x: string]: any;
}

export default function CustomButton({ title, ...props }: ButtonProps) {
  return (
    <Box w="full">
      <Button w="full" {...props}>
        {title}
      </Button>
    </Box>
  );
}
