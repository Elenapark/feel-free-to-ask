import { Button } from '@chakra-ui/react';

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
    <Button {...props} onClick={onClick}>
      {title}
    </Button>
  );
}
