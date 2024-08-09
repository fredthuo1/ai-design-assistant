const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('AI Design Assistant Backend');
});

app.post('/suggestions', async (req, res) => {
    const { design, context, mode } = req.body;

    console.log("Received request for suggestions:");
    console.log("Design:", design);
    console.log("Context:", context);
    console.log("Mode:", mode);

    const systemMessage = {
        role: "system",
        content: "You are a professional design consultant. Your task is to provide actionable and detailed suggestions to improve the user's design based on industry best practices."
    };

    let userMessageContent;

    if (mode === 'quick') {
        userMessageContent = `
        Given the following design data and context:

        Design: ${design}

        Context: ${context}

        Please provide a brief summary of the most important design improvement suggestions focusing on:
        1. Color scheme and contrast.
        2. Layout and spacing.
        3. Typography and readability.
        `;
    } else {
        userMessageContent = `
        Given the following design data and context:

        Design: ${design}

        Context: ${context}

        Please provide a detailed analysis with specific design improvement suggestions focusing on:
        1. Color scheme and contrast.
        2. Layout and spacing.
        3. Typography and readability.
        `;
    }

    const userMessage = {
        role: "user",
        content: userMessageContent
    };

    try {
        console.log("Sending request to OpenAI API...");
        const completion = await openai.chat.completions.create({
            messages: [systemMessage, userMessage],
            model: "gpt-4",
        });

        console.log("Received response from OpenAI API:", completion);

        const suggestions = completion.choices[0].message.content.trim().split('\n').filter(s => s);

        const structuredSuggestions = {
            "Color Scheme and Contrast": suggestions.slice(0, 2),
            "Layout and Spacing": suggestions.slice(2, 4),
            "Typography and Readability": suggestions.slice(4)
        };

        console.log("Parsed suggestions:", structuredSuggestions);

        res.json(structuredSuggestions);
    } catch (error) {
        console.error("Error generating suggestions:", error);
        res.status(500).json({ error: "Failed to generate suggestions" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
