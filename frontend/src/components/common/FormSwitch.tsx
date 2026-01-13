import React from 'react';
import { FormControlLabel, Switch, FormHelperText, FormControl } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface FormSwitchProps {
    name: string;
    label: string;
}

const FormSwitch: React.FC<FormSwitchProps> = ({ name, label }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormControl error={!!error} component="fieldset" margin="normal">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!value}
                                onChange={(e) => onChange(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={label}
                    />
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
            )}
        />
    );
};

export default FormSwitch;
