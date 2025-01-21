
# Facebook Clone

This is a Facebook clone project built with Node.js, Express, MongoDB, and Socket.IO. It includes features such as user authentication, posting, messaging, and real-time notifications.

## Features

- User Authentication (Registration, Login, Logout)
- Google OAuth Authentication
- Create, Read, Update, and Delete Posts
- Like, Comment, and Share Posts
- Create and View Stories
- Real-time Messaging with Socket.IO
- Follow and Unfollow Users
- View User Profiles and Bios
- Upload and Manage Profile and Cover Photos

## Dependencies

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.IO](https://socket.io/)
- [Cloudinary](https://cloudinary.com/)
- [Multer](https://github.com/expressjs/multer)
- [Passport](http://www.passportjs.org/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/facebook-clone.git
   cd facebook-clone/backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the backend directory and add your environment variables based on the .env.example file.

4. Start the MongoDB service using Docker:
   ```sh
   docker-compose up
   ```

5. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user
- `GET /auth/logout` - Logout a user
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

### Users

- `POST /users/follow` - Follow a user
- `POST /users/unfollow` - Unfollow a user
- `GET /users/friend-request` - Get all friend requests
- `GET /users/user-to-request` - Get all users for friend requests
- `GET /users/mutual-friends` - Get all mutual friends
- `GET /users` - Get all users
- `GET /users/profile/:userId` - Get user profile
- `GET /users/check-auth` - Check user authentication
- `PUT /users/bio/:userId` - Create or update user bio
- `PUT /users/profile/:userId` - Update user profile
- `PUT /users/profile/cover-photo/:userId` - Update cover photo

### Posts

- `POST /posts` - Create a new post
- `GET /posts` - Get all posts
- `GET /posts/user/:userId` - Get posts by user ID
- `POST /posts/likes/:postId` - Like a post
- `POST /posts/comments/:postId` - Comment on a post
- `POST /posts/share/:postId` - Share a post
- `POST /story` - Create a new story
- `GET /story` - Get all stories

### Messages

- `GET /users/get-messages/:id` - Get messages between users

## WebSocket Events

- `sendMessage` - Send a message
- `receiveMessage` - Receive a message
- `getOnlineUsers` - Get online users


## License

This project is licensed under the MIT License.
