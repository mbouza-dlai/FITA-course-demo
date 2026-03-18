# Retro Style Trivia Game App — Prompt Sequences

Initial scope was previously discussed with an LLM, which generated the main prompts (1.1, 1.2, 2.1, 2.2, 2.3, 2.5).

This app was originally built and deployed using Lovable

## Step 1: Build an MVP

### Prompt 1.1 — Initial Build 

Build a simple web trivia game with a retro arcade theme.

Requirements:

Use HTML, CSS, and JavaScript.

Use the Open Trivia DB API to fetch trivia questions.

Fetch 5 multiple choice questions from the API.

Display one question at a time with 4 answer buttons.

When the player selects an answer, immediately show if it is correct or incorrect.

Keep track of the score.

After the 5th question, show a "Game Over" screen with the final score.

Visual style:

Retro arcade aesthetic.

Dark background with neon colors (cyan, pink, purple).

Pixel-style font if possible.

Buttons should look like arcade buttons.

Keep the code beginner-friendly and well organized.

### Prompt 1.2: Add score persistance
Improve the existing trivia game.

Add score persistence so the player's best score is saved locally.

Requirements:

Use browser localStorage to store the highest score ever achieved.

When the game starts, display "High Score".

If the player beats the high score, update it.

The high score should remain even after refreshing the page.

Keep everything simple and beginner-friendly.

## Step 2: Add functionalities to the APP
### Prompt 2.1: Add progression system (leveling up)
Enhance the trivia game by adding a progression system.

The player should level up based on their score.

Example levels:

Rookie

Player

Arcade Pro

Trivia Master

Arcade Legend

Requirements:

Show the player's current level on the screen.

Update the level as the score increases.

Display a fun "LEVEL UP!" message when the player reaches a new level.

Keep the retro arcade style.

### Prompt 2.2: Add speed bonus system
Add a speed bonus system to the trivia game.

Requirements:

Each question should have a 10 second timer.

The faster the player answers correctly, the more bonus points they earn.

Example:

correct answer = 10 points

plus up to 10 bonus points depending on speed

Display a countdown timer on the screen.

Keep the UI consistent with the retro arcade theme.

### Prompt 2.3: Add power-ups
Add power-ups to the trivia game.

Add two simple power-ups:

50/50 Removes two incorrect answers.

Skip Question Skips the current question without losing points.

Requirements:

The player can use each power-up once per game.

Show the power-ups as arcade-style buttons.

Disable them after they are used.

### Prompt 2.4: Debug score display
The score display is not tight. For example, it shows 34 / 5. The /5 is lingering from the original code, where each question was 1 point, and there were 5 questions, but that is not the case now. Just show the current score.

Note: it took some iterations, it wasn't fixing the score.

### Prompt 2.5: Add random events
Add random fun events to the trivia game.

Before some questions (around 20% of the time), trigger a random event.

Example events:

Double Points Round (next question worth double points)

Lightning Round (player has only 5 seconds to answer)

Bonus Question (correct answer gives extra points)

Display a big arcade-style message announcing the event before the question appears.

### Step 3: Adjust UI and interactions

### Prompt 3.1: Adjust the dynamic of the random events and add questions dynamically
Make double points event less frequent. Also, add more questions dynamically according to this logic: If 3 out of the 5 original questions are correct you level up and get 5 more, and repeat the process until the player has less than 3 correct answers in the batch of 5.

### Prompt 3.2: Adjust when random events appear
Please don't add the random events at the beginning of the play. They should happen randomly, but start appearing as you advance the game and get points.

### Prompt 3.3: Remove the one of the power-ups
Please remove the 50/50 power up and its button.
