# Flashcards-app — Prompt Sequences

Initial MVP scope was previously discussed with an LLM, which generated the first prompt (1.1).

The app was originaly built with Copilot (GPT-5.3-Codex)

## Version 1: Build an MVP

### Prompt 1.1 — Initial Build 
Objective: Create a basic web-based flashcard app where users can create and view flashcards for study purposes.

Features:  
    
    User Interface:
        Develop a simple and clean web interface for creating and viewing flashcards.
        Include functionality to add new flashcards consisting of only text.
     
    Flashcard Functionality:
        Enable users to add, edit, and delete flashcards.
        Provide an interface to flip through flashcards for study purposes.
  
Technology Stack:

    Use basic web technologies: HTML, CSS, and JavaScript.

Deliverables:

    A functional web application that allows users to create, view, and manage flashcard


**Note:** the agent added local persistence without me asking for it - is this something we want to address somehow?

### Prompt 1.2 - Adjust UI
I'd like for the different areas (Create New Flashcard, Manage Flashcards, and Study mode) to be in different tabs.

### Prompt 1.3 - Adjust UI
Now I want some changes in the UI for the study mode. I want the cards to look more like actual cards, with a more vertical shape, and also to add the flip animation when you go from front to back.

### Prompt 1.3 - Make it "prettier"

Great! Now make it prettier: keep all the functionalities as they are right now, but use nicer colors. Use a color palette that aligned with the deeplearning.ai.

### Prompt 1.4 - Remove pop-ups from edit mode.
Change the edit mode so that the changes aren't made through the browser pop-ups. When the user clicks on "Edit", expand the card details and allow for changes there.

## Version 2: Add functionalities

### Prompt 2.1: Add edits
Let's add some additional features. First, in the learning mode, add the option to make edits. For example, if the user notices a mistake during the learning session, they should be able to fix it.

### Prompt 2.2: Add shuffling to cards
Now please add a toggle bar to allow for shuffling cards in study mode.

### Prompt 2.3: Fix UI
Place the toggle bar on the top, below Study mode title. Also, make the Next, Prev, Edit current card buttons centered with respect to the card, right now they are left aligned.

### Prompt 2.3: Debug shuffling is not working
You added to toggle bar for shuffling, but you didn't add the actual toggle functionality, because switching the toggle bar does nothing. Please fix this.

### Prompt 2.4: Add "Known" checkbox
Add a "Known" checkbox for each card. If the user marks it, then the card is omitted from the loop in study mode. 

### Prompt 2.5: Debug checkbox isn't there
I don't see the checkbox for the cards in Study Mode

### Prompt 2.6: Debug "known" behavior
Currently, when the user marks a card as known, it skips directly to the next card. Please avoid this, the user should still click on Next to go to the next card.

## Version 3: Add connection to an LLM

### Prompt 3.1: Add connection to OpenAI
Once the user has gone through all of the flashcards, and at least 75% of them are marked as known, I want the app to prompt the user if they want to automatically generate new cards.

If yes, generate them using an openai llm.
If no, keep showing the current card deck.

Make sure you implement a stack with questions, so that the user gets the new cards instantly, without any delay. 

Once the user achieves 50% known rate, you can start creating the cards stash in preparation for later.

The new cards should be added to the user's stack.

Note: I was asked to add an OpenAI API key in .env

**LLM next steps suggestion: **
*Next steps you may want:

1. Add your OpenAI key in .env and run the app to test the full flow end-to-end.
2. If you want, I can tune how many cards are injected each time (currently 3) and the buffer size (currently 6).
3. I can also make the generation prompt a custom in-app modal (instead of browser confirm) while keeping the same visual style.*

### Prompt 3.2: Apply suggestions
1. Done
2. Have 10 in buffer but inject cards 5 in 5
3. Please do

### Prompt 3.3: Debug - New question pop-up at the start of the app
I immediately got the pop-up for new cards right after opening the app!

The pop-up should **only** appear on study mode, and after all the cards have been gone through AND the user has marked at least 75% as known.

**Note**: took a couple of iterations, where the behavior stayed the same

### Prompt 3.4: Debug - fix the counter for the cards, and Previous behavior
When I  mark a card as known it is removed from the counter of total cards, I don't want the counter to change. 
Also, I asked that once a card is marked as known it is removed from the stack, if the user marks a card as known and moves on, but then wants to go back to the card using the Previous button, this won't match their previous card. I want this fixed. 

### Prompt 3.5: Debug - fix bug
There is a small bug. If I reopen the app and go to study mode, and if the original cards loaded by the user are all learned I see a message saying there are no cards, while in the card stack I still have plenty unknown cards that were ai generated. I'd like the app to consider all of the cards. 
