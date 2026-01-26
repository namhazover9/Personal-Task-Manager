import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextFieldProps } from '@mui/material';
import { format, parseISO, isValid } from 'date-fns';

interface FormDateProps {
    name: string;
    label: string;
    slotProps?: TextFieldProps;
}

const FormDate: React.FC<FormDateProps> = ({ name, label, slotProps }) => {
    const { control } = useFormContext();

    // Helper to parse value to Date object safely
    const parseValue = (value: any): Date | null => {
        if (!value) return null;
        if (value instanceof Date) return isValid(value) ? value : null;
        if (typeof value === 'string') {
            // Try parsing ISO string or YYYY-MM-DD
            const parsed = parseISO(value);
            return isValid(parsed) ? parsed : null;
        }
        return null;
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DatePicker
                    label={label}
                    value={parseValue(value)}
                    onChange={(date) => {
                        // Store as YYYY-MM-DD string to avoid timezone issues
                        if (date && isValid(date)) {
                            onChange(format(date, 'yyyy-MM-dd'));
                        } else {
                            onChange(null);
                        }
                    }}
                    format="dd/MM/yyyy" // Display format as requested
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
