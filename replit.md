# Overview

This is an Agentic AI Tools application that provides AI-powered utilities through a web interface. The application leverages Google's Gemini AI to offer three main features: text summarization, task generation from goals, and inspirational quote generation. Built with Node.js and Express on the backend, it serves a simple web frontend that allows users to interact with AI agents through a clean, modern interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture

**Technology Stack**: Node.js with Express 5.x framework

**Design Pattern**: The application follows a simple server-side architecture with tool-based functions that act as AI agents. Each tool (`summarizerTool`, `taskGeneratorTool`, `quoteTool`) is implemented as an async function that interfaces with the Gemini AI API.

**Rationale**: Express was chosen for its simplicity and widespread adoption in Node.js applications. The tool-based approach allows for easy extension with additional AI agents in the future.

**API Structure**: RESTful endpoint design (implied from frontend fetch call to `/agent` endpoint) that accepts POST requests with a mode parameter to determine which AI tool to invoke.

## Frontend Architecture

**Technology Stack**: Vanilla HTML, CSS, and JavaScript served as static files

**Design Pattern**: Single-page application with client-side JavaScript handling API calls and DOM manipulation

**Rationale**: No framework overhead was needed for this simple interface. Direct DOM manipulation keeps the application lightweight and fast.

## AI Integration

**Service**: Google Gemini AI (via `@google/genai` SDK v1.30.0)

**Model**: gemini-2.5-flash for content generation

**Architecture Decision**: Each tool function constructs specific prompts and calls the Gemini API directly. The summarizer tool focuses on concise key point extraction, the task generator creates actionable numbered lists, and the quote tool generates motivational quotes.

**Rationale**: Gemini was selected as the AI provider, likely for its balance of performance and cost. The flash model variant provides quick responses suitable for interactive web applications.

## Error Handling

**Approach**: Custom error objects with statusCode properties for HTTP status mapping. Input validation occurs at the tool level before API calls.

**Rationale**: Early validation prevents unnecessary API calls and provides clear user feedback.

## Security

**CORS Configuration**: Enabled via cors middleware to allow cross-origin requests

**API Key Management**: Environment variable-based configuration using dotenv

**Rationale**: Standard security practices for API key protection and controlled cross-origin access.

# External Dependencies

## AI Service
- **Google Gemini AI**: Primary AI service provider accessed through `@google/genai` SDK
- **Authentication**: API key-based authentication via `GEMINI_API_KEY` environment variable
- **Model Used**: gemini-2.5-flash for text generation tasks

## npm Packages
- **express** (^5.1.0): Web server framework
- **cors** (^2.8.5): Cross-Origin Resource Sharing middleware
- **dotenv** (^17.2.3): Environment variable management
- **@google/genai** (^1.30.0): Official Google Generative AI SDK
- **@types/node** (^22.13.11): TypeScript type definitions for Node.js (development tooling)

## Runtime Requirements
- **Node.js**: Version 20.0.0 or higher (required by @google/genai package)

## Configuration Requirements
- Environment variable `GEMINI_API_KEY` must be set for the application to function
- Default server port: 3000