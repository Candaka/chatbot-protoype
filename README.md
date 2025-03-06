# AI Chat Application (ChatGPT-like Prototype)

This is a full-stack application that simulates the functionality of ChatGPT, featuring a React frontend, Node.js/Express backend, and MongoDB database.

## Features

- User authentication (register, login, logout)
- Chat interface with message history
- Dark/light mode toggle
- Conversation management
- API integration for AI responses (with fallback mocking)
- Responsive design for mobile and desktop

## Prerequisites

Before setting up the project, ensure you have the following installed:
- Node.js (v14.x or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Project Structure

```
chatbot-prototype/
├── client/               # React frontend
│   ├── public/           
│   └── src/              
│       ├── components/   # React components
│       ├── context/      # React context providers
│       └── ...
└── server/               # Express backend
    ├── controllers/      # Route controllers
    ├── middleware/       # Express middleware
    ├── models/           # Mongoose models
    ├── routes/           # Express routes
    └── ...
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/chatbot-prototype.git
cd chatbot-prototype
```

### 2. Backend Setup

```bash
cd server
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and OpenAI API key
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

### 4. Running the Application Locally

In one terminal, start the backend:
```bash
cd server
npm run dev
```

In another terminal, start the frontend:
```bash
cd client
npm start
```

The application should now be running at `http://localhost:3000`

## Deploying to Vercel

1. Create a Vercel account if you don't have one.

2. Install the Vercel CLI:
```bash
npm install -g vercel
```

3. Configure environment variables in Vercel:
   - MONGODB_URI: Your MongoDB connection string
   - JWT_SECRET: A secret key for JWT token generation
   - OPENAI_API_KEY: Your OpenAI API key (or mock API key)

4. Deploy the application:
```bash
vercel
```

5. Follow the prompts to complete the deployment.

## Replacing the Placeholder API with DeepSeek API

When the DeepSeek API becomes available, follow these steps to integrate it:

1. Register for a DeepSeek API key.

2. Update the `completionController.js` file in the `server/controllers` directory:
   - Replace the OpenAI API URL with the DeepSeek API endpoint
   - Update the request format according to DeepSeek's API documentation
   - Update environment variables to store the DeepSeek API key

Example code modification (assuming a similar API structure):

```javascript
// Replace this code in completionController.js
const response = await axios.post(
  'https://api.deepseek.com/v1/chat/completions', // Updated API endpoint
  {
    model: 'deepseek-model-name', // Replace with actual model name
    messages: messagesForAI,
    max_tokens: 1000,
  },
  {
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`, // Updated environment variable
      'Content-Type': 'application/json',
    },
  }
);

// And update the response parsing according to DeepSeek's response format
aiResponse = response.data.choices[0].message.content; // Adjust as needed
```

3. Update the environment variables:
   - Add `DEEPSEEK_API_KEY` to your `.env` file
   - If deploying, add this variable to your deployment environment as well

## Customization and Extension

- **UI Customization**: Edit the Tailwind CSS configuration in `client/tailwind.config.js`
- **AI Behavior**: Modify the `mockAIResponse` function in `completionController.js` to change fallback responses
- **Adding Features**: Consider adding features like message pruning, conversation export, or voice input

## License

MIT
