# Unit converter APP — Prompt Sequences

Initial MVP scope was previously discussed with an LLM, which generated the first prompt 

The app was originaly built with Copilot (GPT-5.3-Codex)

## Version 1: Build an MVP

### Prompt 1.1 — Initial Build 
I'm creating a unit converter app and would like your help generating the code for an MVP (Minimum Viable Product). Here are the key aspects I'm focused on:

- Core Functionality: 
    - The app should perform basic conversions for commonly used units in categories like distance (meters to kilometers), weight (grams to kilograms), and volume (liters to gallons).
    - Users should be able to select an original unit, a converted unit, and input a value for conversion.

- Key Features for MVP:
    - Relevant Unit Filtering: When a user selects an original unit, only provide a list of corresponding convertible units (e.g., after selecting "meters," show units like "kilometers" and "feet").
    - User-Friendly Interface: Implement a clean design that's easy to navigate, focusing on functionality over aesthetics for this MVP phase.

- Design Guidance:
    - The interface should be straightforward with an emphasis on usability.
    - Keep the layout simple and intuitive with clear buttons and labels.

- Testing and Feedback:
    - Ensure conversion calculations are accurate.
    - Be prepared to iterate based on user feedback, focusing on smooth functionality for this initial version.

Can you generate the necessary code for this MVP and suggest any foundational elements that could be built upon later as we expand the app?

### Prompt 1.2 - Debug: buttons not working
THe code isn't working, since I can't select any units. Please keep things simple

### Prompt 1.3 - Fix limited scope
Please add some more metrics. It is very limited options, for example for volume units you only get liter, ml and gallons.

