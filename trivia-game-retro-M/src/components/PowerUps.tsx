import { cn } from "@/lib/utils";

interface PowerUpsProps {
  usedSkip: boolean;
  disabled: boolean;
  onSkip: () => void;
}

const PowerUps = ({ usedSkip, disabled, onSkip }: PowerUpsProps) => (
  <div className="flex gap-3 mb-4 justify-center">
    <button
      onClick={onSkip}
      disabled={usedSkip || disabled}
      className={cn(
        "font-arcade text-[10px] md:text-xs px-4 py-2 border-2 border-accent transition-all",
        usedSkip
          ? "opacity-30 cursor-not-allowed text-muted-foreground border-muted-foreground"
          : "text-accent glow-cyan hover:brightness-125 hover:scale-105"
      )}
    >
      {usedSkip ? "SKIP ✗" : "SKIP ▶"}
    </button>
  </div>
);

export default PowerUps;
