# Trivia-Fiesta Backend

### End Point

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

