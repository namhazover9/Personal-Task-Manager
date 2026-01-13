import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextFieldProps } from '@mui/material';

interface FormDateProps {
    name: string;
    label: string;
    slotProps?: TextFieldProps;
}

const FormDate: React.FC<FormDateProps> = ({ name, label, slotProps }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DatePicker
                    label={label}
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? date.toISOString() : null)}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            margin: 'normal',
                            error: !!error,
                            helperText: error?.message,
                            ...slotProps,
                        },
                    }}
                />
            )}
        />
    );
};

export default FormDate;
