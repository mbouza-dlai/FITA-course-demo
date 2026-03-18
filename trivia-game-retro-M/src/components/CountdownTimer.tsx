import { useEffect, useState } from "react";

interface CountdownTimerProps {
  startTime: number;
  paused: boolean;
  onTimeUp: () => void;
  timerSeconds: number;
}

const CountdownTimer = ({ startTime, paused, onTimeUp, timerSeconds }: CountdownTimerProps) => {
  const [remaining, setRemaining] = useState(timerSeconds);

  useEffect(() => {
    setRemaining(timerSeconds);
  }, [startTime, timerSeconds]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const left = Math.max(0, timerSeconds - elapsed);
      setRemaining(left);
      if (left <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [startTime, paused, onTimeUp, timerSeconds]);

  const pct = (remaining / timerSeconds) * 100;
  const isUrgent = remaining <= 3;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className={`font-arcade text-xs ${isUrgent ? "text-destructive animate-blink" : "text-foreground glow-cyan"}`}>
          TIME
        </span>
        <span className={`font-arcade text-xs ${isUrgent ? "text-destructive animate-blink" : "text-foreground glow-cyan"}`}>
          {Math.ceil(remaining)}s
        </span>
      </div>
      <div className="w-full h-3 border-2 border-foreground/30 bg-background">
        <div
          className={`h-full transition-all duration-100 ${
            isUrgent ? "bg-destructive" : "bg-secondary"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default CountdownTimer;
