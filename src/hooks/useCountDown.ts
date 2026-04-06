import { useEffect } from 'react';

export function useCountDown({
    seconds,
    onFinishCallback,
    setSeconds,
}: {
    seconds: number;
    setSeconds: React.Dispatch<React.SetStateAction<number>>;
    onFinishCallback: () => void;
}) {
    useEffect(() => {
        if (seconds <= 0) return;

        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval); // stop the timer
                    onFinishCallback(); // call your finish function
                    return 0;
                }
                return prev - 1; // decrement countdown
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds > 0]);
}
