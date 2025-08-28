# Zporter: Youth Football Companion

This is a Next.js starter project built in Firebase Studio. It's a comprehensive application for managing youth football matches, including live logging, AI-powered summaries, and detailed match planning.

## Getting Started

Follow these steps to get the development environment running on your local machine.

### 1. Install Dependencies

First, install the necessary Node.js packages using npm:

```bash
npm install
```

### 2. Set Up Environment Variables

The application uses Genkit to connect to Google's AI models. You will need a `GEMINI_API_KEY` to run the AI features.

1.  Create a file named `.env` in the root of the project.
2.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the key to your `.env` file:

```env
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

You will also need to configure the base URL for the backend API you have built.

```env
# Example for local development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run the Development Servers

The project requires two concurrent processes: the Next.js web application and the Genkit AI server. You should run these commands in two separate terminals.

**Terminal 1: Start the Next.js App**

This command starts the frontend application using Turbopack for faster development.

```bash
npm run dev
```

Your application will be running at [http://localhost:9002](http://localhost:9002).

**Terminal 2: Start the Genkit AI Flows**

This command starts the Genkit server and watches for any changes in your AI flow files.

```bash
npm run genkit:watch
```

With both servers running, the application will be fully functional.
