import { FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

interface SwitchButtonProps {
  isChecked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  FormLabelText?: string;
  [x: string]: any;
}

export default function CustomSwitch({
  id,
  isChecked,
  onChange,
  size = 'sm',
  FormLabelText,
  FormLabelSize = 'small',
  ...props
}: SwitchButtonProps) {
  return (
    <FormControl display="flex" alignItems="center">
      <Switch
        id={id}
        size={size}
        isChecked={isChecked}
        onChange={onChange}
        {...props}
      />
      {FormLabelText && (
        <FormLabel htmlFor={id} mb="0" fontSize={FormLabelSize}>
          {FormLabelText}
        </FormLabel>
      )}
    </FormControl>
  );
}
