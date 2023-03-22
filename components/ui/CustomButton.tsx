import { Button } from '@chakra-ui/react';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick: () => void;
  isDisabled?: boolean;
  [x: string]: any;
}

export default function CustomButton({
  title,
  onClick,
  isDisabled = false,
  ...props
}: ButtonProps) {
  return (
    <Button {...props} onClick={onClick} isDisabled={isDisabled}>
      {title}
    </Button>
  );
}
