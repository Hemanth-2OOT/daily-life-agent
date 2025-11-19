require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

// Setup express app
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve frontend

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ""
});

// Helper to call Groq model
async function callGroq(prompt) {
    const response = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
}

// ─────────────────────────────────────────
// AGENT TOOLS
// ─────────────────────────────────────────

async function summarizerTool(text) {
    if (!text || text.trim() === '') {
        throw { statusCode: 400, message: "Text is required for summarization." };
    }

    const prompt = `Summarize the following text in 3 simple, clear sentences:\n\n${text}`;
    return await callGroq(prompt);
}

async function taskGeneratorTool(goal) {
    if (!goal || goal.trim() === '') {
        throw { statusCode: 400, message: "Goal is required for task generation." };
    }

    const prompt = `Given this goal: "${goal}", generate 5 actionable steps in a numbered list.`;
    return await callGroq(prompt);
}

async function quoteTool() {
    const prompt = "Give one short motivational quote. Keep it to one sentence.";
    return await callGroq(prompt);
}

// ─────────────────────────────────────────
// AGENT CONTROLLER
// ─────────────────────────────────────────

async function agentController(mode, input) {
    switch (mode) {
        case 'summarize':
            return await summarizerTool(input);

        case 'tasks':
            return await taskGeneratorTool(input);

        case 'quote':
            return await quoteTool();

        default:
            throw { statusCode: 400, message: "Invalid mode" };
    }
}

// ─────────────────────────────────────────
// API ENDPOINT
// ─────────────────────────────────────────

app.post('/agent', async (req, res) => {
    try {
        const { mode, input } = req.body;

        if (!mode) {
            return res.status(400).json({ error: "Mode is required" });
        }

        const output = await agentController(mode, input);
        res.json({ output });

    } catch (error) {
        const code = error.statusCode || 500;
        res.status(code).json({ error: error.message });
    }
});

// ─────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});
