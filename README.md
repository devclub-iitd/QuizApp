# QuizUp

There are two types of users -

* Players
* Quizmaster

Quizmasters ccan create rooms and add questions, while players can join rooms and answer questions.

## Workflows

### Player Workflow

* Login (Temporary or Permanent)
* Splash Screen
  * Open Rooms
  * Enter Code (Provided by a Quizmaster)
* Room
  * Start Time (With Timer for last 3 mins)
  * Details of scoring/time limit/question no.
  * Automatically go to Question screen when the quiz starts
* Question Screen
  * Timer
  * Text Question
  * Options (4)
  * Leaderboard (Optional)
  * Statistics of other users for each option (After Time limit)(Optional)
  * Automatically move to next question after time limit
* Results Screen
  * Score
  * Leaderboard
  * Statistics (Optional)
  
### Quizmaster Workflow

* Login (With Password)
* Splash Screen
  * Create New Room
  * View Current Rooms
* Room
  * Toggle Active
  * Time of starting (Editable until start of quiz)
  * Room Code
  * Toggle Open (Optional)
  * Go to Questions Screen
  * Scoring Options (Uniform for all questions)
  * Players joined (If active)
  * Previous Results (If inactive)
* Questions Screen
  * All room questions visible
  * Add Question
* Question
  * Text
  * Options (4)
  * Answer
* Result Screen
  * Only Leaderboard and (Optionally) Statistics
  
## Database

* Player
  * ID (Unique)
* Quiz Master
  * ID (Unique)
  * Password
  * RoomList
* Room
  * ActiveToggle
  * UserList (Player, Score)
  * QuestionList
  * QuizMaster (Unique)
  * ID (Unique) -> RoomCode
  * Scoring Data (TimeLimit, TimeBonus, PointsPerQuestion)
  * Start Time
  * OpenToggle (Optional)
* Question
  * ID
  * Text
  * Options (4)
  * Answer

## Viewing the UI

* Clone the repo
* Run `npm install`
* Run `npm start`
* View at `localhost:3000`
* It may be necessary to delete `tsconfig.json`
