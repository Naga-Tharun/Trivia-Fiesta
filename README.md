# Trivia-Fiesta Backend

### End Point

### BASEURL: https://trivia-fiesta.nagatharun.me

1. baseurl/auth/sign-up : (POST)

   Body: (profileUrl, phone is optional)

   ```
   {
       "email": "test@test.com",
       "password": "test",
       "confirm_password": "test",
       "name": "test",
       "username": "test",
       "phone: "1234567890",
       "profileUrl": "localhost:8000/a.jpg"
   }
   ```
   Response:

   ```
   {
       "email": "test4@test.com",
       "name": "test4",
       "username": "test4",
       "phone": "1234567894",
       "id": "646cc87d33a2bb532529e2bd",
       "profileUrl": "localhost:8000/a.jpg",
       "token": "eewfsiuheufidjwiodjwfirjfuwhudhoijwe....",
       "request": true
   }
   ```
2. baseurl/auth/sign-in : (POST)

   Body:

   ```
   {
       "email": "test4@test.com",
       "password": "test4"
   }
   ```
   Response:

   ```
   {
       "email": "test4@test.com",
           "name": "test4",
           "username": "test4",
           "phone": "1234567894",
           "id": "646cc87d33a2bb532529e2bd",
           "profileUrl": "localhost:8000/a.jpg",
       "token": "eewfsiuheufidjwiodjwfirjfuwhudhoijwe....",
           "request": true
   }
   ```
3. baseurl/user/sign-out/:id : (POST)

   Body:

   ```
   {
       "token": "eewfsiuheufidjwiodjwfirjfuwhudhoijwe...."
   }
   ```
   Response:

   ```
   {
       "request": true
   }
   ```
4. baseurl/user/update/:id : (POST)

   Body: (the previous values are passsed unaltered along with new updates) (phone, profileUrl are optional)

   ```
   {
       "email": "test@test.com",
       "password": "test_update",
       "name": "test_update",
       "username": "test_update",
       "phone: "1234567890",
       "profileUrl": "localhost:8000/a.jpg",
       "token": "eewfsiuheufidjwiodjwfirjfuwhudhoijwe....",
   }
   ```
   Response: (phone and profileUrl will be sent if modified)

   ```
   {
       "email": "test@test.com",
       "name": "test_update",
       "username": "test_update",
       "id": "64689ff54ca94574a6574422",
       "request": true
   }
   ```
5. baseurl/user/delete-account/:userId : (POST)

   Body:

   ```
   {
       "password": test,
       "token": "eewfsiuheufidjwiodjwfirjfuwhudhoijwe....",
   }
   ```
   Response:

   ```
   {
       "request": true
   }
   ```
6. baseurl/user/generate-questions : (POST)

   Body:

   ```
   {
       "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
       "categories": "songs, movies",
       "numQuestions": 5
   }
   ```
   Response:

   ```
   [
       {
           "category": "songs",
           "question": "Which song became the fastest music video to reach 1 billion views on YouTube?",
           "options": [
               "Gangnam Style",
               "See You Again",
               "Despacito",
               "Shape of You"
           ],
           "correct_answer": "Gangnam Style"
       },
       {
           "category": "movies",
           "question": "Who directed the movie 'Inception'?",
           "options": [
               "Christopher Nolan",
               "Steven Spielberg",
               "James Cameron",
               "Quentin Tarantino"
           ],
           "correct_answer": "Christopher Nolan"
       }
   ]
   ```
7. baseurl/single-player/generate-questions : (POST)

   Body:

   ```
   {
       "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
       "categories": "songs, movies",
       "numQuestions": 5,
       “username”: test,
       “userId”: 64f1be92dfe3f9d4f19c73f5
   }
   ```
   Response:

   ```
   {
       ”gameId": "6551caf8f03b662fd9defbbb",
       "questions": [
           {
               "category": "Cars",
               "question": "Which car company produces the iconic Mustang?",
               "options": [
                   "Ford",
                   "Chevrolet",
                   "Dodge",
                   "Tesla"
               ],
               "correct_answer": "Ford"
           },
           {
               "category": "Adventure",
               "question": "What is the highest mountain in the world?",
               "options": [
                   "Mount Everest",
                   "Mount Kilimanjaro",
                   "Matterhorn",
                   "K2"
               ],
               "correct_answer": "Mount Everest"
           },
           {
               "category": "Cars",
               "question": "Which car brand has a logo featuring four linked rings?",
               "options": [
                   "Audi",
                   "BMW",
                   "Mercedes-Benz",
                   "Lamborghini"
               ],
               "correct_answer": "Audi"
           }
       ]
   }
   ```
8. baseurl/single-player/update-score : (POST)

   Body:

   ```
   {
       "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
       “gameId”: 6551c71ea445d8beb510fe15,
       "score”: 5,
       “userId”: 64f1be92dfe3f9d4f19c73f5
   }
   ```
   Response:

   ```
   {
       "message": "Score updated successfully"
   }
   ```
9. baseurl/single-player/get-scores : (POST)

   Body:

   ```
   {
       "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
       “userId”: 64f1be92dfe3f9d4f19c73f5
   }
   ```
   Response:

   ```
   [
       {
           "_id": "6551c71ea445d8beb510fe15",
           "score": 35,
           "timestamp": "2023-11-13T06:50:06.591Z"
       },
       {
           "_id": "6551caf8f03b662fd9defbbb",
           "score": 0,
           "timestamp": "2023-11-13T07:06:32.052Z"
       }
    ]
   ```
10. baseurl/multi-player/create-room : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "categories": "songs, movies",
        “userId”: 64f1be92dfe3f9d4f19c73f5
    }
    ```
    Response:

    ```
    {
        "roomId": "22883",
        "creatorId": "64f1be92dfe3f9d4f19c73f5",
        "participants": [
            "64f1be92dfe3f9d4f19c73f5"
        ],
        "categories": [
            "Cars, Adventure"
        ],
        "_id": "6554559f1a2a9447bbaf5566"
    }
    ```
11. baseurl/multi-player/join-room : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 01283,
        “userId”: 64f1be92dfe3f9d4f19c73f5
    }
    ```
    Response:

    ```
    {
        "message": true,
        "creatorId": "64f1be92dfe3f9d4f19c73f5",
        "participants": [
            {
                "_id": "64f1be92dfe3f9d4f19c73f5",
                "email": "test@test.com",
                "name": "test",
                "username": "test"
            },
            {
                "_id": "6555ada5e80f53e94325ce09",
                "email": "test1@test.com",
                "name": "test1",
                "username": "test1"
            }
        ],
        "categories": [
            "Cars",
            "Adventure"
        ],
        "roomId": "99395"
    }
    ```
12. baseurl/multi-player/leave-room : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 01283,
        “userId”: 64f1be92dfe3f9d4f19c73f5
    }
    ```
    Response:

    ```
    {
        "message": true
    }
    ```
13. baseurl/multi-player/update-categories : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 01283,
        "chosenCategories": Books, Movies
    }
    ```
    Response:

    ```
    {
        "categories": [
            "Cars",
            "Adventure",
            "Movies",
            "Books"
        ]
    }
    ```
14. baseurl/multi-player/remove-categories : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 01283,
        "chosenCategories": Books, Movies
    }
    ```
    Response:

    ```
    {
        "categories": [
            "Cars",
            "Adventure"
        ]
    }
    ```
15. baseurl/multi-player/player-ready-status : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 01283,
        "userId": "64f1be92dfe3f9d4f19c73f5"
        "isReady": "false"
    }
    ```
    Response:

    ```
    {
        "message": true,
        "allPlayersReady": false,
        "playersReadyList": [
            "test"
        ]
    }
    ```
16. baseurl/multi-player/room-details : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 23906,
    }
    ```
    Response:

    ```
    {
        "message": true,
        "participants": [
            {
                "_id": "64f1be92dfe3f9d4f19c73f5",
                "email": "test@test.com",
                "name": "test",
                "username": "test"
            },
            {
                "_id": "6555ada5e80f53e94325ce09",
                "email": "test1@test.com",
                "name": "test1",
                "username": "test1"
            }
        ],
        "categories": [
            "Cars",
            "Adventure"
        ],
        "playersReadyList": [],
        "roomId": "23906"
    }
    ```
17. baseurl/multi-player/check-all-player-ready : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 23906,
    }
    ```
    Response:

    ```
    {
        "message": false
    }
    ```
18. Sockets are created for `disconnect`, `joinRoom`, `startGame`

    1. joinRoom requires: userId, roomId does not emit any response
    2. startGame requires: userId, roomId, numQuestions emits the questions for the game in the form of an array

    ```
    Array (2)
    0 {category: "Cars", question: "Which car brand is known for its luxury vehicles?", options: ["Toyota", "Mercedes-Benz", "Honda", "Ford"], correct_answer: "Mercedes-Benz"}
    1 {category: "Adventure", question: "What is the highest mountain in the world?", options: ["Mount Everest", "K2", "Kangchenjunga", "Makalu"], correct_answer: "Mount Everest"}
    ```
    HTML file for running a http server to test the sockets (run it using `http-server`)

    ```
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Socket.IO Example</title>
      <script src="https://cdn.socket.io/4.3.1/socket.io.js"></script>
      <script>
        // Connect to the server
        const socket = io('https://trivia-fiesta.nagatharun.me/', {
          transports: ['websocket', 'polling'],
        }); 

        function joinRoom() {
          // Get input values
          const roomId = document.getElementById('roomId').value;
          const userId = document.getElementById('userId').value;

          // Emit 'joinRoom' event to the server
          socket.emit('joinRoom', { roomId, userId });
        }

        function startGame() {
          // Get input values
          const roomId = document.getElementById('roomId').value;
          const userId = document.getElementById('userId').value;
          const numQuestions = parseInt(document.getElementById('numQuestions').value);

          // Emit 'startGame' event to the server
          socket.emit('startGame', { roomId, userId, numQuestions });
        }

        // Listen for 'gameQuestions' event from the server
        socket.on('gameQuestions', (questions) => {
          const questionsContainer = document.getElementById('questions');
          questionsContainer.innerHTML = ''; // Clear previous questions

          console.log(questions);

          questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.innerHTML = `<strong>Question ${index + 1}:</strong><br>
                                          <strong>Category:</strong> ${question.category}<br>
                                          <strong>Question:</strong> ${question.question}<br>
                                          <strong>Options:</strong> ${question.options.join(', ')}<br>
                                          <strong>Correct Answer:</strong> ${question.correct_answer}<br><br>`;
            questionsContainer.appendChild(questionElement);
          });
        });
      </script>
    </head>
    <body>
      <label for="roomId">Room ID:</label>
      <input type="text" id="roomId"><br><br>

      <label for="userId">User ID:</label>
      <input type="text" id="userId"><br><br>

      <label for="numQuestions">Number of Questions:</label>
      <input type="number" id="numQuestions"><br><br>

      <button onclick="joinRoom()">Join Room</button>
      <button onclick="startGame()">Start Game</button>

      <div id="questions"></div>
    </body>
    </html>

    ```

19. baseurl/multi-player/update-score : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 01283,
        "userId": "64f1be92dfe3f9d4f19c73f5"
        "score": 100
    }
    ```
    Response:

    ```
    {
        "message": true
    }
    ```

20. baseurl/multi-player/final-result : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 99395,
    }
    ```
    Response:

    ```
    {
        "message": true,
        "roomId": "99395",
        "scores": [
            {
                "username": "test",
                "score": 100
            },
            {
                "username": "test1",
                "score": 0
            }
        ],
        "winner": {
            "username": "test",
            "score": 100
        }
    }
    ```

21. baseurl/multi-player/user-scores : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "userId": 64f1be92dfe3f9d4f19c73f5,
    }
    ```
    Response:

    ```
    [
        {
            "_id": "655c7eff33b354b9078bf9c6",
            "roomId": "99255",
            "scores": [
                {
                    "username": "test",
                    "score": 0
                }
            ],
            "winner": {
                "username": "test",
                "score": 0
            }
        },
        {
            "_id": "655c7f4f33b354b9078bf9d2",
            "roomId": "99395",
            "scores": [
                {
                    "username": "test",
                    "score": 100
                },
                {
                    "username": "test1",
                    "score": 200
                }
            ],
            "winner": {
                "username": "test1",
                "score": 200
            }
        }
    ]
    ```
22. baseurl/team-player/create-room : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        “userId”: 64f1be92dfe3f9d4f19c73f5
    }
    ```
    Response:

    ```
    {
        "roomId": "09180",
        "creatorId": "6555ada5e80f53e94325ce09",
        "team1": {
            "leader": "6555ada5e80f53e94325ce09",
            "players": [
                "6555ada5e80f53e94325ce09"
            ],
            "score": 0
        },
        "team2": {
            "leader": null,
            "players": [],
            "score": 0
        },
        "categories": null,
        "availableCategories": null,
        "currentCategory": null,
        "isGameStarted": false,
        "currentTurn": "team1",
        "_id": "6583e27fdb54c1fbaf8e0de5"
    }
    ```
23. baseurl/team-player/join-room : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 09180,
        “userId”: 64f1be92dfe3f9d4f19c73f5,
        "teamChoice": team2
    }
    ```
    Response:

    ```
    {
        "message": true,
        "team1": [
            {
                "_id": "6555ada5e80f53e94325ce09",
                "email": "test1@test.com",
                "name": "test1",
                "username": "test1"
            }
        ],
        "team2": [
            {
                "_id": "64f1be92dfe3f9d4f19c73f5",
                "email": "test@test.com",
                "name": "test",
                "username": "test"
            }
        ],
        "categories": null,
        "availableCategories": null,
        "isGameStarted": false,
        "currentTurn": "team1",
        "roomId": "09180"
    }
    ```
24. baseurl/team-player/leave-room : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 01283,
        “userId”: 64f1be92dfe3f9d4f19c73f5
    }
    ```
    Response:

    ```
    {
        "message": true
    }
    ```
25. baseurl/team-player/update-categories : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 09180,
        "chosenCategories": Books, Movies
    }
    ```
    Response:

    ```
    {
        "categories": [
            "Movies",
            "Books"
        ]
    }
    ```
26. Sockets are created for `teamDisconnect`, `joinTeamRoom`, `startTeamGame`, `teamCategoryChoice`, `teamQuestionChoice`, `alterTeamTurn`

    HTML file for running a http server to test the sockets (run it using `http-server`)

    ```
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Socket.io Test</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.3.2/socket.io.js"></script>
        <script>
            const socket = io('http://localhost:8082'); // Replace with your server URL
            
            socket.on('connect', () => {
                console.log('Connected to the server');
            });

            socket.on('message', (message) => {
                console.log('Server message:', message);
            });

            function joinRoom() {
            // Get input values
            const roomId = document.getElementById('roomId').value;
            const userId = document.getElementById('userId').value;

            // Emit 'joinRoom' event to the server
            socket.emit('joinTeamRoom', { roomId, userId });
            }

            function startGame() {
            // Get input values
            const roomId = document.getElementById('roomId').value;
            const userId = document.getElementById('userId').value;

            // Emit 'startGame' event to the server
            socket.emit('startTeamGame', { roomId, userId });
            }

            socket.on('teamSelectCategory', (categories) => {
            console.log(categories);
            });

            socket.on('gameQuestions', (questions) => {
                console.log('Received game questions:', questions);
                // Process and display the questions on the UI
                // Example: Add the questions to a list on the HTML page
                const questionsList = document.getElementById('questionsList');
                questionsList.innerHTML = ''; // Clear previous questions
                questions.forEach((question, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Question ${index + 1}: ${question.id}`;
                    questionsList.appendChild(listItem);
                });
            });

            socket.on('Question', (question) => {
                console.log('Received game question:', question);
                // Process and display the questions on the UI
                // Example: Add the questions to a list on the HTML page
                const questionsList = document.getElementById('questionsList');
                questionsList.innerHTML = ''; // Clear previous questions
                const listItem = document.createElement('li');
                listItem.textContent = `Question ${1}: ${question.question}`;
                questionsList.appendChild(listItem);

            });

            socket.on('gameEnded', (message) => {
                console.log(message);
            });

            // Example function to emit a team1CategoryChoice event
            function chooseCategory() {
                const category = document.getElementById('categoryInput').value; // Get category from input field
                const roomId = document.getElementById('roomId').value;
                console.log(category);
                socket.emit('teamCategoryChoice', { chosenCategory: category, roomId: roomId });
            }

            function chooseQuestionId() {
                const questionId = document.getElementById('questionIdInput').value; // Get category from input field
                const roomId = document.getElementById('roomId').value;
                console.log(questionId);
                socket.emit('teamQuestionChoice', { chosenQuestionId: questionId, roomId: roomId });
            }

            function alterTurn() {
                const roomId = document.getElementById('roomId').value; // Get category from input field
                console.log(roomId);
                socket.emit('alterTeamTurn', { roomId: roomId });
            }
        </script>
    </head>
        <body>
            <h1>Socket.io Test</h1>
            <label for="roomId">Room ID:</label>
            <input type="text" id="roomId"><br><br>
            <label for="userId">User ID:</label>
            <input type="text" id="userId"><br><br>
            <button onclick="joinRoom()">Join Room</button>
            <button onclick="startGame()">Start Game</button>

            <p>Choose a category:</p>
            <input type="text" id="categoryInput">
            <button onclick="chooseCategory()">Choose Category</button>
            <h2>Game Questions:</h2>
            <ul id="questionsList"></ul>
            <p>Choose a questionId:</p>
            <input type="text" id="questionIdInput">
            <button onclick="chooseQuestionId()">Choose Question Id</button>
            <br><br>
            <button onclick="alterTurn()">Alter Turn</button>
        </body>
    </html>

    ```
   
27. baseurl/team-player/update-score : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 01283,
        "team": team1,
        "score": 100
    }
    ```
    Response:

    ```
    {
        "message": true,
        "room": {
            "team1": {
                "leader": "6555ada5e80f53e94325ce09",
                "players": [
                    {
                        "_id": "6555ada5e80f53e94325ce09",
                        "email": "test1@test.com",
                        "name": "test1",
                        "username": "test1"
                    }
                ],
                "score": 10
            },
            "team2": {
                "leader": "64f1be92dfe3f9d4f19c73f5",
                "players": [
                    {
                        "_id": "64f1be92dfe3f9d4f19c73f5",
                        "email": "test@test.com",
                        "name": "test",
                        "username": "test"
                    }
                ],
                "score": 0
            },
            "_id": "6583e27fdb54c1fbaf8e0de5",
            "roomId": "09180",
            "creatorId": "6555ada5e80f53e94325ce09",
            "categories": [
                "Movies",
                "Books"
            ],
            "availableCategories": [
                "Movies",
                "Books"
            ],
            "currentCategory": null,
            "isGameStarted": false,
            "currentTurn": "team1",
            "createdAt": "2023-12-21T07:00:15.024Z",
            "updatedAt": "2023-12-21T07:19:19.640Z",
            "__v": 2
        }
    }
    ```

28. baseurl/team-player/final-result : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "roomId": 99395,
    }
    ```
    Response:

    ```
    {
        "message": true,
        "roomId": "09180",
        "winnerTeam": {
            "leader": "6555ada5e80f53e94325ce09",
            "players": [
                {
                    "_id": "6555ada5e80f53e94325ce09",
                    "email": "test1@test.com",
                    "name": "test1",
                    "username": "test1"
                }
            ],
            "score": 10
        },
        "looserTeam": {
            "leader": "64f1be92dfe3f9d4f19c73f5",
            "players": [
                {
                    "_id": "64f1be92dfe3f9d4f19c73f5",
                    "email": "test@test.com",
                    "name": "test",
                    "username": "test"
                }
            ],
            "score": 0
        }
    }
    ```
29. baseurl/team-player/check-answer : (POST)

    Body:

    ```
    {
        "token": "eefeibeifnidnodqdownfowfnwfoiwfjwfw....",
        "questionId": 6527cd1326ad7aaaf8aac6f6,
        "chosenAnswer": Ed Sheeran
    }
    ```
    Response:

    ```
    {
        "message": true,
    }
    ```
