import { useSnackbar, VariantType } from 'notistack';
import { useCallback } from 'react';

const useToast = () => {
    const { enqueueSnackbar } = useSnackbar();

    const showToast = useCallback((message: string, variant: VariantType = 'default') => {
        enqueueSnackbar(message, {
            variant,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            autoHideDuration: 3000
        });
    }, [enqueueSnackbar]);

    return {
        success: (message: string) => showToast(message, 'success'),
        error: (message: string) => showToast(message, 'error'),
        info: (message: string) => showToast(message, 'info'),
        warning: (message: string) => showToast(message, 'warning'),
        // default
        toast: (message: string) => showToast(message),
    };
};

export default useToast;
