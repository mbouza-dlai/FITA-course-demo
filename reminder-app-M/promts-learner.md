# Reminder app — Prompt Sequences

Initial MVP scope was previously discussed with an LLM, which generated the first prompt 

The app was originaly built with Copilot (GPT-5.3-Codex)

## Step 1: Build an MVP

### Prompt 1.1 — Initial Build 
Objective: Develop a simple standalone reminder app with the following features:

- Create Reminders:
    Implement functionality for users to create a reminder with a title, date, and time.
- Basic Notifications:
    Set up local notifications to alert users at the specified time.
- Simple User Interface:
    Design a minimalistic interface with a main screen displaying a list of active reminders.
    Include basic navigation for adding, viewing, and deleting reminders.
- Reminder Customization:
    Allow users to label each reminder (e.g., "Medication", "Water").
- Mark as Completed:
    Enable users to mark reminders as completed or delete them as necessary.
- Edit Existing Reminders:
    Provide the option to edit the time or title of an existing reminder.


Constraints:
- No data persistence is required beyond the app's runtime.
- No user authentication or synchronization with external services.
- Keep the design and code simple to focus on core functionality.

Expected Outcome: A functional prototype of a reminder app that demonstrates basic reminder creation, notification, and management within a user-friendly interface.


### Prompt 1.2 - Update color theme
Please make the color palette more aligned with the deeplearning.ai platform, avoid dark modes please

## Step 2 - Customize the APP

### Prompt 2.1 - Add custom labels
Add the option of a custom label for the remainder.


### Prompt 2.2 - Debug: custom label position
The custom label should be under the Label dropdown menu

### Prompt 2.3 - Save custom labels
Once you add a custom label, that label should be included in the option in the dropdown menu

### Prompt 2.4 - Add repetition
Add an option of a repeated remainder.

### Prompt 2.5 - Embed a calendar
Embed a calendar to see the individual reminders. Also, in repeated events I want to be able to mark individual instances as done, but not the whole reminder (which should continue).


### Prompt 2.6 - Debug: change button names
Change the Skip/unskip button for repeated remainders to "Mark this instance Complete".

### Prompt 2.7 - Debug: wrong button functionality
Currently, the mark this instance complete only applies to the first item, what about the rest? I want it to activate as you click on the event in the calendar.