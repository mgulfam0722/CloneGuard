import { useEffect, useRef, useCallback } from 'react';
import { useAxiosRequest } from './useAxiosRequest';

export function useAxiosOnMount<Result>(
    config: () => Parameters<ReturnType<typeof useAxiosRequest<Result>>['sendRequest']>[0] | null,
) {
    const { data, loading, error, message, sendRequest } = useAxiosRequest<Result>();

    const configRef = useRef(config);
    configRef.current = config;

    // Extract type of config object
    type ConfigType = Parameters<typeof sendRequest>[0];

    // Accept optional override of config
    const refetch = useCallback(
        async (overrideConfig?: ConfigType | null) => {
            const cfg = overrideConfig ?? configRef.current?.();
            if (cfg) {
                try {
                    await sendRequest(cfg);
                } catch (err) {
                    console.error('Refetch failed:', err);
                }
            }
        },
        [sendRequest],
    );

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, loading, error, message, refetch };
}
