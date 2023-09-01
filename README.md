# Trivia-Fiesta Backend

### End Point

1. baseurl/auth/sign-up : (POST)
   body: (profileUrl, phone is optional)

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
	"request": true
}
```


2. baseurl/auth/sign-in : (POST)

    body:

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
    	"request": true
}
```


3. baseurl/user/update/:id : (POST)
   body:
   (the previous values are passsed unaltered along with new updates)
   (phone, profileUrl are optional)

```
{
	"email": "test@test.com",
	"password": "test_update",
	"name": "test_update",
	"username": "test_update",
	"phone: "1234567890",
	"profileUrl": "localhost:8000/a.jpg"
}
```

    Response:
	(phone and profileUrl will be sent if modified)

```
{
	"email": "test@test.com",
	"name": "test_update",
	"username": "test_update",
	"id": "64689ff54ca94574a6574422",
	"request": true
}
```


4. baseurl/user/delete-account/:userId (POST)

    body:

```
{
	"password": test
}
```

    Response:

```
{
	"request": true
}
```
