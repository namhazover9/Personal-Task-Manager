import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

// Define the props for the FormInput component
interface FormInputProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  label: string;
}

// A reusable form input component integrated with react-hook-form and MUI
const FormInput: React.FC<FormInputProps> = ({ name, label, ...props }) => {
  const { control } = useFormContext();
  
  // Render a controlled TextField with validation error handling
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error?.message}
          {...props}
        />
      )}
    />
  );
};

export default FormInput;