import { useEffect } from "react";
import { useTrivia, getLevel, getNextLevel, getTimerSeconds } from "@/hooks/useTrivia";
import ScoreHeader from "./ScoreHeader";
import ArcadeButton from "./ArcadeButton";
import GameOver from "./GameOver";
import CountdownTimer from "./CountdownTimer";
import PowerUps from "./PowerUps";
import EventAnnouncement from "./EventAnnouncement";

const TriviaGame = () => {
  const {
    loading, gameOver, currentQuestion, currentIndex, score, batchSize,
    selectedAnswer, highScore, isNewHighScore, totalScore, leveledUp, newLevelName,
    questionStartTime, lastBonus, usedFiftyFifty, usedSkip, hiddenAnswers,
    activeEvent, showingEvent, batchIndex, round, fetchingMore,
    fetchQuestions, selectAnswer, nextQuestion, timeUp, useFiftyFifty, useSkip, dismissEvent,
  } = useTrivia();

  const level = getLevel(totalScore);
  const nextLvl = getNextLevel(totalScore);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  if (loading || fetchingMore) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-arcade text-sm text-foreground glow-cyan animate-blink">
          {fetchingMore ? "ROUND " + (round + 1) + "..." : "LOADING..."}
        </p>
      </div>
    );
  }

  const isTimeUp = selectedAnswer === "__TIME_UP__";
  const timerSeconds = getTimerSeconds(activeEvent);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        {showingEvent && activeEvent && (
          <EventAnnouncement event={activeEvent} onDismiss={dismissEvent} />
        )}
        {gameOver ? (
          <div className="arcade-border p-8 md:p-12 flex flex-col items-center">
            <GameOver score={score} isNewHighScore={isNewHighScore} leveledUp={leveledUp} newLevelName={newLevelName} level={level.name} onRestart={fetchQuestions} />
          </div>
        ) : currentQuestion ? (
          <>
            {round > 1 && (
              <div className="text-center mb-2">
                <span className="font-arcade text-[10px] md:text-xs text-accent glow-pink">ROUND {round}</span>
              </div>
            )}
            <ScoreHeader score={score} current={batchIndex + 1} total={batchSize} highScore={highScore} level={level.name} nextLevel={nextLvl} totalScore={totalScore} />
            {activeEvent && !showingEvent && (
              <div className="text-center mb-2">
                <span className={`font-arcade text-[10px] md:text-xs ${
                  activeEvent === "double_points" ? "text-primary glow-pink" :
                  activeEvent === "lightning" ? "text-destructive" :
                  "text-secondary glow-cyan"
                } animate-blink`}>
                  {activeEvent === "double_points" && "⚡ 2× POINTS ACTIVE ⚡"}
                  {activeEvent === "lightning" && "⚡ LIGHTNING ROUND ⚡"}
                  {activeEvent === "bonus_question" && "★ BONUS QUESTION ★"}
                </span>
              </div>
            )}
            {!showingEvent && (
              <CountdownTimer startTime={questionStartTime} paused={!!selectedAnswer} onTimeUp={timeUp} timerSeconds={timerSeconds} />
            )}
            <PowerUps
              usedSkip={usedSkip}
              disabled={!!selectedAnswer || showingEvent}
              onSkip={useSkip}
            />
            <div className="arcade-border p-6 md:p-8">
              <h2
                className="font-terminal text-2xl md:text-4xl text-foreground mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.shuffled
                  .filter((answer) => !hiddenAnswers.includes(answer))
                  .map((answer) => {
                    let state: "idle" | "correct" | "incorrect" = "idle";
                    if (selectedAnswer) {
                      if (answer === currentQuestion.correct_answer) state = "correct";
                      else if (answer === selectedAnswer && !isTimeUp) state = "incorrect";
                    }
                    return (
                      <ArcadeButton
                        key={answer}
                        label={answer}
                        state={state}
                        disabled={!!selectedAnswer || showingEvent}
                        onClick={() => selectAnswer(answer)}
                      />
                    );
                  })}
              </div>
              {selectedAnswer && (
                <div className="flex flex-col items-center mt-6 gap-2">
                  {isTimeUp && (
                    <p className="font-arcade text-xs text-destructive animate-blink">TIME&apos;S UP!</p>
                  )}
                  {lastBonus > 0 && (
                    <p className="font-arcade text-xs text-secondary glow-cyan">
                      +10 PTS  +{lastBonus} SPEED BONUS!
                    </p>
                  )}
                  {selectedAnswer && !isTimeUp && selectedAnswer === currentQuestion.correct_answer && lastBonus === 0 && (
                    <p className="font-arcade text-xs text-secondary glow-cyan">+10 PTS</p>
                  )}
                  <button
                    onClick={nextQuestion}
                    className="font-arcade text-xs text-foreground glow-cyan underline hover:brightness-125"
                  >
                    {batchIndex + 1 < batchSize ? "NEXT ▶" : "SEE RESULTS ▶"}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TriviaGame;
