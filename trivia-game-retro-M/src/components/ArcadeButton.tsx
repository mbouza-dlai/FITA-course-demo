import { cn } from "@/lib/utils";

interface ArcadeButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  state?: "idle" | "correct" | "incorrect";
}

const ArcadeButton = ({ label, onClick, disabled, state = "idle" }: ArcadeButtonProps) => {
  const stateClasses = {
    idle: "bg-primary border-b-[6px] border-primary/60 hover:brightness-125 active:border-b-[2px] active:translate-y-[4px]",
    correct: "bg-success border-b-[6px] border-success/60 glow-green",
    incorrect: "bg-destructive border-b-[6px] border-destructive/60 glow-red",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-terminal text-2xl md:text-3xl px-4 py-4 transition-none",
        "text-primary-foreground font-bold tracking-wide",
        stateClasses[state],
        disabled && state === "idle" && "opacity-40 cursor-not-allowed",
      )}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
};

export default ArcadeButton;
