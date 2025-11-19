require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || '' 
});

async function summarizerTool(text) {
    const prompt = `Summarize the following text concisely while maintaining key points:\n\n${text}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text || 'Unable to generate summary';
}

async function taskGeneratorTool(goal) {
    const prompt = `Given this goal: "${goal}", generate a clear, actionable list of tasks to accomplish it. Format the response as a numbered list.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text || 'Unable to generate tasks';
}

async function quoteTool() {
    const prompt = 'Generate an inspiring and motivational quote. Just provide the quote and its author.';
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text || 'Unable to generate quote';
}

async function agentController(mode, input) {
    switch (mode) {
        case 'summarizer':
            return await summarizerTool(input);
        case 'taskGenerator':
            return await taskGeneratorTool(input);
        case 'quote':
            return await quoteTool();
        default:
            throw new Error('Invalid mode');
    }
}

app.post('/agent', async (req, res) => {
    try {
        const { mode, input } = req.body;
        
        if (!mode) {
            return res.status(400).json({ error: 'Mode is required' });
        }
        
        const result = await agentController(mode, input);
        res.json({ result });
    } catch (error) {
        console.error('Agent error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
