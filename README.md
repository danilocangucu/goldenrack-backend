# Golden Rack BACKEND

Welcome to the Golden Rack's backend! This API was built by [Danilo Canguçu](https://github.com/danilocangucu) as part of Integrify's 2024 Node.js cohort. The project provides a platform for buying/selling vinyls from record stores, including, among others, operations for creating, retrieving, updating, and deleting records. It's mainly built using TypeScript Express.js and MongoDB – [see full technologies, in Built With section](#built-with) – offering a robust backend solution for [golden ears](https://en.wikipedia.org/wiki/Golden_ear).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v12.x or later recommended)
- npm (Node Package Manager)
- yarn (package manager)

### Installation

1. Clone the repository to your local machine:

   ```sh
   git clone https://github.com/danilocangucu/golden-rack-backend.git
   cd golden-rack-backend
   ```

2. Install the required packages:

   ```sh
   npm install
   ```

   or

      ```sh
   yarn install
   ```

4. Set up your environment variables:

   - Create a new file named `.env` and include the variables MONGODB_URL and PORT. [Contact me](malito:daniloccangucu@gmail.com) to have these variables values.

5. Start the application:

   - For development:
     ```sh
     npm run dev
     ```
   - For production:
     ```sh
     npm run start
     ```

## Running the Tests

To ensure the reliability and correctness of the API, unit tests and integration tests are provided. Run the tests using the following command:

```sh
npm run test
```

## Entity Relationship Diagram
![Golden Rack ERD](https://i.postimg.cc/1PqZSN9J/goldenrack-erd-v2.png)
*The diagram was created with [databasediagram.com](https://databasediagram.com/).*

## API Endpoints

The API can also be accessed in an AWS EC2 instance at http://13.49.67.88:5000 and supports the following operations:

### Authorization API Endpoints
Base URL: `/api/v1/auth`

#### Register User
- **POST /register**: Create a new user account.
  - Request Body:
    ```json
    {
        "email": "johndoe@example.com",
        "userName": "johndoe",
        "password": "test123",
        "firstName": "John",
        "lastName": "Doe"
    }
    ```
  - Response:
    ```json
    {
        "status": "success",
        "message": "User registered successfully.",
        "data": {
            "id": "660ea0515b16fa19fef1f238",
            "email": "johndoe@example.com",
            "userName": "johndoe",
            "firstName": "John",
            "lastName": "Doe",
            "role": "Customer",
            "banned": false,
            "orderHistory": [
                "660ea0515b16fa19fef1f236"
            ]
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjBlYTA1MTViMTZmYTE5ZmVmMWYyMzgiLCJ1c2VyUm9sZSI6IkN1c3RvbWVyIiwiaXNVc2VyQmFubmVkIjpmYWxzZSwiaWF0IjoxNzEyMjM0NTc3LCJleHAiOjE3MTIzMjA5Nzd9.MsRiKUZAR94DRZbiOk91kBkleG_tuY-0kNGI3jlcTe4"
    }
    ```

#### Login User
- **POST /login**: Authenticate a user and obtain an authorization token.
  - Request Body:
    ```json
    {
        "email": "johndoe@example.com",
        "password": "test123"
    }
    ```
  - Response:
    ```json
    {
        "status": "success",
        "message": "Login successful",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY4MGFmYzcwZWU3MzRlYTM5OWFlMDQiLCJ1c2VyUm9sZSI6IkFkbWluIiwiaXNVc2VyQmFubmVkIjp0cnVlLCJpYXQiOjE3MTIyMzQ2MDksImV4cCI6MTcxMjMyMTAwOX0.L3ufDNdVoGhhAFdpsp26JqoD73lGBJctI_hsrBB6_KI"
    }
    ```

#### Verify Token
- **POST /verify**: Verify the authenticity of an authorization token.
  - Request Header:
    ```
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY4MGFmYzcwZWU3MzRlYTM5OWFlMDQiLCJ1c2VyUm9sZSI6IkFkbWluIiwiaXNVc2VyQmFubmVkIjp0cnVlLCJpYXQiOjE3MTIyMzQ2MzMsImV4cCI6MTcxMjMyMTAzM30.wh1tCsCFhYuU_Ai0oAaosee7-nH2vwbpHTUdvJgT7Jw
    ```
  - Response:
    ```json
    {
        "status": "success",
        "message": "Token is valid",
        "data": {
            "id": "65f80afc70ee734ea399ae04",
            "email": "johndoe@example.com",
            "userName": "johndoe",
            "firstName": "John",
            "lastName": "Doe",
            "role": "Admin",
            "banned": true,
            "orderHistory": [
                "65fd921ff855b31d09bda502"
            ]
        }
    }
    ```

### Records API Endpoints
Base URL: `/api/v1/records`

- **GET /**: Retrieve all records.
- **POST /**: Create a new record. Requires an authorization token from an admin or a store.
  - Request Body:
    ```json
    {
      "title": "Back in Black",
      "artist": "AC/DC",
      "genre": "5e1a8b9c9b1d9ad471bc9c24",
      "year": 1980,
      "description": "The seventh studio album by AC/DC, known for its hard-hitting rock anthems and iconic guitar riffs.",
      "condition": "65f80bd670ee734ea399ae13",
      "price": 55,
      "store": "65f9db69025a97b0d4b8e171"
    }
    ```
  - Response:
    ```json
    {
       "message": "Record created successfully",
       "status": "success"
    }
    ```
    
- **GET /:id**: Retrieve a single record by its ID.
   - Request Parameter: ```662ea63f5c29c0fa4fdb3f17```
   - Response:
     ```json
     [
       {
           "_id": "662ea63f5c29c0fa4fdb3f17",
           "genre": {
               "_id": "66155311c88445b733cfdb7b",
               "name": "Progressive Rock"
           },
           "title": "The Wall",
           "artist": "Pink Floyd",
           "description": "The eleventh studio album by Pink Floyd, a rock opera that explores themes of isolation, abandonment, and personal identity.",
           "year": 1979,
           "stock": {
               "_id": "662ea63f5c29c0fa4fdb3f18",
               "stockItems": [
                   {
                       "_id": "662ea63f5c29c0fa4fdb3f29",
                       "condition": {
                           "_id": "65f80bd670ee734ea399ae09",
                           "condition": "Very Good"
                       },
                       "store": {
                           "_id": "65f9db69025a97b0d4b8e171",
                           "name": "Vinyyli Paratiisi",
                           ...
                           "shippingInfo": {
                               "_id": "65f9dbcc025a97b0d4b8e172",
                               "domestic": {
                                   "standard": "Standard shipping: €5.00 (3-5 business days)",
                                   "express": "Express shipping: €10.00 (1-2 business days)"
                               },
                               "international": {
                                   "economy": "International Economy: €15.00 (7-14 business days)",
                                   "express": "International Express: €25.00 (3-5 business days)"
                               }
                           },
                           "recordsInStock": [
                               {
                                   "record": "65f9d2d1025a97b0d4b8e173",
                                   "stockItems": [
                                       "66275cd5fbc2f496c6687053",
                                       "662eba793cf8c38382a27e1b",
                                       "662f21d2d5bbe13ff1a026d6"
                                   ]
                               },
                               ...
                           ],
                       },
                       "price": 30,
                   }
               ],
           },
       }
     ]
     ```
    
- **GET /genres**: Retrieve all records genres.
   - Response:
   ```json
   [
       {
           "_id": "661552e7c88445b733cfdb79",
           "name": "Pop"
       },
       {
           "_id": "6615530cc88445b733cfdb7a",
           "name": "Rock"
       },
       {
           "_id": "66155311c88445b733cfdb7b",
           "name": "Progressive Rock"
       }
       ,
       ...
   ]
   ```
- **GET /conditions**: Retrieve all records conditions.
   - Response:
   ```json
   {
       "data": [
           {
               "_id": "65f80bd270ee734ea399ae08",
               "condition": "New"
           },
           {
               "_id": "65f80bce70ee734ea399ae07",
               "condition": "Like New"
           },
           {
               "_id": "65f80bd670ee734ea399ae09",
               "condition": "Very Good"
           },
           {
               "_id": "65f80bd670ee734ea399ae10",
               "condition": "Good"
           },
           {
               "_id": "65f80bd670ee734ea399ae13",
               "condition": "Fair"
           },
           ... 
       ],
       "status": "success",
       "message": "Conditions fetched with success"
   }
   ```

### Users API Endpoints
Base URL: `/api/v1/users`

  - **GET /**: Retrieve all users. Requires an authorization token from an admin.
    - Request Header:
    ```
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY4MGFmYzcwZWU3MzRlYTM5OWFlMDQiLCJ1c2VyUm9sZSI6IkFkbWluIiwiaXNVc2VyQmFubmVkIjpmYWxzZSwiaWF0IjoxNzEyMjk4Mzc0LCJleHAiOjE3MTIzODQ3NzR9.bMKZF-ItcS_og2sTWoxQr7paTWQVRf8_YFfRbtBgJYo
    ``` 
     - Response:
       ```json
       {
          "data": [
              {
                  "_id": "65f80afc70ee734ea399ae04",
                  "role": "Admin",
                  "email": "jane.smith@example.com",
                  "hashedPassword": "$2b$10$3PxzUyL9.vmwtWGzJZux6.UjLmV7HNc93Eb1WZt9FtspVI2kel16O",
                  "userName": "janesmith",
                  "firstName": "Jane",
                  "lastName": "Smith",
                  "banned": false,
                  "orderHistory": [
                      "65fd921ff855b31d09bda502"
                  ],
                  "__v": 1
             },
          ...
          ]
       }
       ```

  - **GET /:userId**: Retrieve a single user by its ID.
  - **PUT /:userId**: Update a user record by its ID. Requires an authorization token from either an admin or the user themselves.
  - **DELETE /:userId**: Delete a user record by its ID. Requires an authorization token from either an admin or the user themselves.
  - **GET /:userId/recover-password**: Request password recovery for the user. Requires authorization from the user themselves.
  - **POST /:userId/change-password**: Change the user's password. Requires authorization from the user themselves.
  - **PATCH /:userId/ban**: Ban or unban a user. Requires authorization from an admin.

### Orders API Endpoints
Base URL: `/api/v1/users/:userId/orderlists`

All following methods require authorization from either an admin or the user themselves.

- **GET /:orderListId**: Retrieve all orders from a specific order list.
  - **Response**:
    ```json
    {
        "status": "success",
        "data": {
            "id": "65fd921ff855b31d09bda502",
            "orders": [
                {
                    "id": "66017e8f81a35f42d2db84e3",
                    "carId": {
                        "brand": {
                            "brand": "Maserati"
                        },
                        "model": "Cleo",
                        "conditions": [
                            {
                                "name": "Mint"
                            }
                        ],
                        "description": "Iconic small car known for its performance and style.",
                        "year": 1987,
                        "price": 23000
                    },
                    "quantity": 1,
                    "orderSum": 23000
                },
                ...
            ]
        },
        "message": "Order list fetched with success"
    }
    ```
    
- **POST /:orderListId**: Add a new order to the specified order list.
  - **Response**:
    ```json
    {
        "status": "success",
        "data": {
             "id": "660eab141caeed62129998b7",
             "carId": "66008215a5d86befd591af34",
             "quantity": 2,
             "orderSum": 46000
        },
        "message": "Order added to Order list"
    }
    ```
    
- **DELETE /:orderListId/orders/:orderId**: Delete a specific order from the specified order list.
  - **Response**:
    ```json
    {
        "status": "success",
        "message": "Order 660178fe622d06aa24ddf88f deleted from Order list 65fd921ff855b31d09bda502"
    }
    ```
- **PUT /:orderListId/orders/:orderId**: Update a specific order in the specified order list.
  - **Request Body**:
    ```json
    {
      "quantity": 2,
      "orderSum": 46000
    }
    ```
  - **Response**:
    ```json
    {
        "status": "success",
        "data": {
            "id": "66017f9f9a93d717f80aa53e",
            "carId": "66008215a5d86befd591af34",
            "quantity": 2,
            "orderSum": 46000
        },
        "message": "Order 66017f9f9a93d717f80aa53e updated from Order list 65fd921ff855b31d09bda502."
    }
    ```

## Built With

- **[Typescript](https://www.typescriptlang.org/)** - A typed superset of JavaScript that compiles to plain JavaScript.
- **[Express.js](https://expressjs.com/)** - The web framework used for building web applications and APIs.
- **[MongoDB](https://www.mongodb.com/)** - The NoSQL database used for storing data.
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling tool for Node.js, providing a schema-based solution to model application data.
- **[Jest](https://jestjs.io/)** - A delightful JavaScript testing framework for unit testing JavaScript code.
- **[Supertest](https://www.npmjs.com/package/supertest)** - A library for testing HTTP servers in Node.js.
- **[MongoDB Memory Server](https://nodkz.github.io/mongodb-memory-server/)** - In-memory MongoDB server for testing.
- **[Joi](https://joi.dev/)** - A powerful schema description language and validator for JavaScript objects.
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)** - A library for hashing passwords.
- **[Dotenv](https://www.npmjs.com/package/dotenv)** - A module for loading environment variables from a `.env` file into `process.env`.
- **[Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** - An implementation of JSON Web Tokens for authentication.
- **[Uuid](https://www.npmjs.com/package/uuid)** - A library for generating UUIDs.
- **[Nodemon](https://nodemon.io/)** - A utility that monitors for changes in files and automatically restarts the server.
- **[Ts-jest](https://www.npmjs.com/package/ts-jest)** - A TypeScript preprocessor with source map support for Jest.
- **[Ts-node](https://www.npmjs.com/package/ts-node)** - TypeScript execution environment and REPL for Node.js.
- **[Generate-password](https://www.npmjs.com/package/generate-password)** - A module for generating random passwords.
