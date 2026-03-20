# To-do app — Prompt Sequences

Initial MVP scope was previously discussed with an LLM, which generated the first prompt 

The app was originaly built with Copilot (GPT-5.3-Codex)

## Version 1: Build an MVP

### Prompt 1.1 — Initial Build 
I need help building a simple and efficient to-do list app. The app should let users create, edit, and delete tasks. Each task needs a title, with an optional description and due date. Users should be able to mark tasks as complete or incomplete using a checkbox. It's important that tasks can be organized into lists and moved around. I’d love the UI to feel clean and inviting—easy to navigate and pleasant to use. Could you whip up something straightforward for this?
Let’s start simple: Please build a basic version of the app where users can create, edit, delete tasks, and mark them complete or incomplete with a checkbox. Ensure each task has a title, and optionally, a description
please create files inside the to-do-app folder

### Prompt 1.2 - Debugging save notes
The app is not working. I can fill in the note fields, but when i click on Add Task nothing happens. Also, each task should have a due date (this is very important for tasks!).

### Prompt 1.3 - Follow-up requests
Now, make it sortable. Also, when you click on Edit, I'd like some nicer interface, definitely not the 3 consecutive pop-ups I'm seeing right now. And move the Done checkbox to the bottom right.

### Prompt 1.4 - Add task organization
Now, I want you to implement the functionality for organizing tasks into lists or projects and allow users to move tasks between these lists

### Prompt 1.5 - Debug: button not working
The Move button to change a Note between lists does nothing. Please fix it.

### Prompt 1.6 - Debug: button has wrong functionality
The move buttons is moving the notes to the default Inbox list, but doesn't let you choose the list you want it moved to. I need you to add this functionality.

### Prompt 1.7 - Adjust UX/UI
I want some changes in the UI the UI: 

1. When I add the list, don't use red to print the "List "work" added.", it looks as it was an error. 
2. The list added message should only appear for a couple of seconds, and not remain forever
3. I should be able to see all lists at the same time. Make the different lists collapsible, in case the user wants to see only some of the tasks

### Prompt 1.8 - Change how lists are saved
On a second thought, lets assign a color for each list, and have all the items mixed, but separated by color, so that the user can also order all the tasks together. Also add a filter with multiple choice to filter through the different lists.

### Prompt 1.9 - Make it prettier
Can you overall make the UI prettier? Make it intuitive and easy to navigate, so users feel comfortable and enjoy managing their tasks in this app. Make sure all the different buttons and menus are noticeable. Don't change any of the current functionalities, just the looks of the APP.

