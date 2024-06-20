YouVote API Documentation


Introduction
Welcome to the YouVote API documentation. This API provides endpoints to manage elections, candidates, votes, and user authentication for the YouVote platform.
This API uses JSON Web Tokens (JWT) for authentication. To access protected endpoints, include a valid JWT token in the Authorization header with the Bearer scheme.



1.	Authentication Endpoints

Register User
•	URL: /register
•	Method: POST
•	Description: Register a new user.
•	Request Body:
o	firstName (string, required): First name of the user.
o	lastName (string, required): Last name of the user.
o	email (string, required): Email address of the user.
o	phoneNumber (string, required): Phone number of the user.
•	Response:
o	message: Success message.

Verify User
•	URL: /verify
•	Method: POST
•	Description: Verify user's email and phone number.
•	Request Body:
o	email (string, required): Email address of the user.
o	emailCode (string, required): Verification code sent to email.
o	phoneCode (string, required): Verification code sent to phone.
•	Response:
o	message: Success message.

Login
•	URL: /login
•	Method: POST
•	Description: Login user and send login credentials via email.
•	Request Body:
o	email (string, required): Email address of the user.
•	Response:
o	message: Success message.

Validate Login
•	URL: /validate-login
•	Method: POST
•	Description: Validate user's login credentials.
•	Request Body:
o	email (string, required): Email address of the user.
o	loginId (string, required): Login ID received via email and phone.
o	loginPassword (string, required): Temporary password received via email and phone.
•	Response:
o	message: Success message.
o	user: User details.
o	token: JWT token for authentication.





2.	Election Endpoints

Create Election (Admin user)
•	URL: /elections
•	Method: POST
•	Description: Create a new election.
•	Authorization: Bearer Token
•	Request Body:
o	title (string): Title of the election.
o	description (string): Description of the election.
o	startDate (Date): Start date of the election.
o	endDate (Date): End date of the election.
•	Response:
o	message: Success message.
o	election: Created election details.

Get All Elections
•	URL: /elections
•	Method: GET
•	Description: Get all elections.
•	Authorization: Bearer Token
•	Response:
o	List of all elections.

Get Election by ID
•	URL: /election/:id
•	Method: GET
•	Description: Get a specific election by ID.
•	Authorization: Bearer Token
•	Response:
o	Election details.




Update Election (Admin user)
•	URL: /elections/:id
•	Method: PUT
•	Description: Update an existing election.
•	Request Body: Same as Create Election.
•	Authorization: Bearer Token
•	Response:
o	message: Success message.
o	election: Updated election details.

Delete Election (Admin user)
•	URL: /elections/:id
•	Method: DELETE
•	Description: Delete an existing election by ID.
•	Authorization: Bearer Token
•	Response:
o	message: Success message.

Get Election Results
•	URL: /elections/:electionId/results
•	Method: GET
•	Description: Get the results of a specific election.
•	Authorization: Bearer Token
•	Response:
o	List of election results.






3.	Candidate Endpoints

Add Candidate to Election (Admin user)
•	URL: /candidates/:electionId
•	Method: POST
•	Description: Add a candidate to an election.
•	Authorization: Bearer Token
•	Request Body:
o	name (string): Name of the candidate.
o	party (string): Political party of the candidate.
•	Response:
o	message: Success message.
o	candidate: Added candidate details.

Get Candidate by ID
•	URL: /candidate/:id
•	Method: GET
•	Description: Get a specific candidate by ID.
•	Authorization: Bearer Token
•	Response:
o	Candidate details.

Get Candidates by Election
•	URL: /candidates/:electionId
•	Method: GET
•	Description: Get all candidates of a specific election.
•	Authorization: Bearer Token
•	Response:
o	List of candidates.


Update Candidate in Election (Admin user)
•	URL: /candidates/:electionId/:candidateId
•	Method: PUT
•	Description: Update a candidate in an election.
•	Request Body: Same as Add Candidate to Election.
•	Authorization: Bearer Token
•	Response:
o	message: Success message.
o	candidate: Updated candidate details.

Delete Candidate from Election (Admin user)
•	URL: /candidates/:electionId/:candidateId
•	Method: DELETE
•	Description: Delete a candidate from an election.
•	Authorization: Bearer Token
•	Response:
o	message: Success message.


4.	Vote Endpoints

Submit Vote
•	URL: /votes
•	Method: POST
•	Description: Submit a vote for an election.
•	Authorization: Bearer Token
•	Request Body:
o	election (string): ID of the election.
o	candidate (string): ID of the candidate.
•	Response:
o	message: Success message.
o	vote: Details of the submitted vote.

Get My Votes
•	URL: /my-votes
•	Method: GET
•	Description: Get all votes made by the user.
•	Authorization: Bearer Token
•	Response:
o	List of votes made by the user.







