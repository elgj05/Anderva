Dear MIT Maker Portfolio reviewer(s),

Please find down below an explanation regarding this part-code project, as requested by the "2023 Maker Portfolio Instructions" guidelines ( Domain-specific requests/Code projects/Minimum requirements for us to review a code project; https://t.ly/TIjwA):

1) Commentary on the anderva/server/src/controllers/auth.controller.ts TypeScript file:

  - The Login Method/Function (lines 39-79) handles user login by verifying credentials and generating an access token if the user is truly/actually registered in the database.
  - In Lines 80-86, the "user" constant verifies user credentials using the CustomUserService class imported from another file in the "services" folder, and generates an access token for authentication.
  - The "Current User" Method in lines 111-113 returns the currently authenticated user. Line 112 returns the current user profile extracted from the access token.
  - The "register" method starting in line 129 handles user registration by creating a new user in the database. Lines 156-158 hashes the user's password, set a default role, and convert their email to lowercase for consistency & data handling purposes later on.
  - The "if" function on lines 160-162 checks if a user with the provided email already exists in the database. If this user doesn't already exist in the database, lines 164-174 create a new user in the database and return the user data using the "omit" utility type, along with an access token for authentication.


This AuthController code snippet demonstrates the implementation of user authentication, login, token management, and registration functionalities in my LoopBack4 Node.js application. I chose to explain this code snippet because I believe it showcases my ability to handle authentication-related tasks efficiently and securely as a programmer, and because authentication has been one of the more difficult processes to comprehend in my internship for creating Anderva, and thus I am proud of sharing the work I have done by writing this code file, as one of the files that I was responsible for writing all by myself. 


P.S. I selected "Other" as a category for the Anderva project, since I consider it to be primarily an entrepreneurship-related maker journey, rather than only a code-related one.
