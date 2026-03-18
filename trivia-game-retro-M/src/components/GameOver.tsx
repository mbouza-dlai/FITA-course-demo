interface GameOverProps {
  score: number;
  isNewHighScore: boolean;
  leveledUp: boolean;
  newLevelName: string;
  level: string;
  onRestart: () => void;
}

const GameOver = ({ score, isNewHighScore, leveledUp, newLevelName, level, onRestart }: GameOverProps) => (
  <div className="flex flex-col items-center gap-8">
    <h1 className="font-arcade text-2xl md:text-4xl text-foreground glow-cyan animate-blink">
      GAME OVER
    </h1>
    <div className="font-arcade text-lg md:text-2xl text-primary glow-pink">
      {score}
    </div>
    {leveledUp && (
      <div className="flex flex-col items-center gap-2">
        <p className="font-arcade text-sm text-secondary glow-cyan animate-blink">
          ⬆ LEVEL UP! ⬆
        </p>
        <p className="font-arcade text-base text-accent glow-pink">
          {newLevelName}
        </p>
      </div>
    )}
    {isNewHighScore && (
      <p className="font-arcade text-sm text-accent glow-pink animate-blink">
        ★ NEW HIGH SCORE ★
      </p>
    )}
    <p className="font-terminal text-xl text-muted-foreground">
      RANK: {level}
    </p>
    <p className="font-terminal text-3xl text-foreground">
      {score >= 60 ? "PERFECT RUN!" : score >= 25 ? "NICE RUN!" : "TRY AGAIN!"}
    </p>
    <button
      onClick={onRestart}
      className="font-arcade text-sm md:text-base bg-primary text-primary-foreground px-8 py-4 border-b-[6px] border-primary/60 hover:brightness-125 active:border-b-[2px] active:translate-y-[4px] transition-none animate-blink"
    >
      PLAY AGAIN
    </button>
  </div>
);

export default GameOver;
