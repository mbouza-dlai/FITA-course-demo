# Sleep-pattern app — Prompt Sequences

Initial MVP scope was previously discussed with an LLM, which generated the first prompt 

The app was originaly built with Copilot (GPT-5.3-Codex)

## Version 1: localStorage

### Step 1: Build an MVP

#### Prompt 1.1 — Initial Build 
Objective:
Build a simple sleep pattern app with the following features using local storage for data persistence.

App Features:
    - User Data Input:
        Prompt the user to enter their name upon first use. Store this in local storage and use it to provide a personalized welcome message each time the app is opened.
        Let the user set a threshold for the minimum desired sleep duration (in hours) which can be adjusted later. Store this value in local storage as well.
     

    - Sleep Tracking:
        Provide input fields for users to enter sleep start time and wake-up time each day.
        Save each sleep session as an entry in local storage, associating it with the respective date.
     

    - Data Visualization:
        Implement basic graphing capabilities to display sleep duration over time. This can be a simple line graph or bar chart showing the sleep duration for the past week.
     

    - Alerts:
        Include an alert feature that triggers if the sleep duration for a given night falls below the user-defined threshold. The alert should notify the user the next time they open the app.

Technical Implementation:

    - Use JavaScript (or your preferred language) for adding logic to the app, incorporating HTML/CSS for the user interface.
    Utilize localStorage capabilities to store all user data and sleep entries.
    - Consider a library like Chart.js or D3.js for rendering graphs, if applicable.

User Interface:

    - Welcome screen displaying a personalized greeting using the user's name.
    - Entry form for sleep tracking and setting the sleep threshold.
    - A section to display saved sleep logs and visualization.
    - Alert feature implementation in case the sleep duration falls below the threshold.

Considerations:

    - Ensure that the app's design is intuitive and accessible, focusing on ease of data input and visualization.
    
Please add all new files inside the sleep-pattern-app folder. I'm also copying the color style for you to build a palette 

#### Prompt 1.2 - Debug: Pop-up not closing
When the apps start, you get a pop-up asking for name and minimum sleep goal, but when I click on "Get Started" the pop-up doesn't close.

#### Prompt 1.3 - Change visual interface
I'm not convinced with the UI. With your expertise, what would you advise to visualize the data?

### Step 2: Add functionalities and improve visualization

#### Prompt 2.1 - Monthly visualization
Please make to visualization monthly rather than weekly?

#### Prompt 2.2 - Debug: block future dates
Block dates in the future, it makes no sense for the user to predict how much they will sleep.

#### Prompt 2.3 - Debug: color of calendar
The color palette for the calendar is wrong. I want it consistent with the rest of the app, which is in light mode, but the calendar is showing in dark-mode

#### Prompt 2.4 - Improve labels
Please change the legend in the chart:
- Sleep Duration — solid line with a circle dot (use line-dot-line marker)
- Goal — long-dash line (matching [7, 4] on the chart)
- Avg — short-dash line (matching [4, 3] on the chart)

#### Prompt 2.5 - Add other months
I want to be able to select different months. The user should be able to navigate from one month to the next (or previous). 

#### Prompt 2.6 - Add Edit capabilities
I want to be able to edit the values entered.  Add the option to edit when you click on a data point (not just hover).
Also, skip the Sleep Log section, since the data is being shown on the charts. Add a button that shows the logs in a pop-up. 


## Version 2: JSON storage
### Step 3: Change storage type
#### Prompt 3.1: Ask for json storage
Please update only the persistence, so that now it uses json and not localSorge. Save the JSON in a backend file, so I get persistence across browsers.


