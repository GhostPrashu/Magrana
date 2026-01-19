import React, { useEffect } from 'react';

const Timer = ({ timeLeft, setTimeLeft, onTimeUp, active }) => {
    useEffect(() => {
        if (!active || timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [active, timeLeft, onTimeUp, setTimeLeft]);

    return (
        <div className="timer">
            Time: {timeLeft}s
        </div>
    );
};

export default Timer;
