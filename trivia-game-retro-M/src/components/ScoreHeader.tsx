interface ScoreHeaderProps {
  score: number;
  current: number;
  total: number;
  highScore: number;
  level: string;
  nextLevel: { threshold: number; name: string } | null;
  totalScore: number;
}

const ScoreHeader = ({ score, current, total, highScore, level, nextLevel, totalScore }: ScoreHeaderProps) => (
  <div className="mb-4 space-y-2">
    <div className="flex justify-between items-center w-full font-arcade text-xs md:text-sm">
      <span className="glow-cyan text-foreground">SCORE: {score}</span>
      <span className="text-accent glow-pink">HI: {highScore}</span>
    </div>
    <div className="flex justify-between items-center w-full font-arcade text-[10px] md:text-xs">
      <span className="text-secondary glow-cyan">LVL: {level}</span>
      {nextLevel && (
        <span className="text-muted-foreground">
          {nextLevel.threshold - totalScore} PTS TO {nextLevel.name}
        </span>
      )}
    </div>
  </div>
);

export default ScoreHeader;
