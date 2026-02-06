import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

const getOpenAI = () => {
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    if (apiKey) {
        if (apiKey.startsWith('gsk_')) {
            return {
                client: new OpenAI({
                    apiKey: apiKey,
                    baseURL: "https://api.groq.com/openai/v1"
                }),
                model: "llama-3.3-70b-versatile"
            };
        }
        return {
            client: new OpenAI({ apiKey }),
            model: "gpt-4o"
        };
    }
    return null;
}

// 1. TOOL DEFINITION
const designToolDefinition = {
    type: "function",
    function: {
        name: "update_website_design",
        description: "Update website design based on user request",
        parameters: {
            type: "object",
            properties: {
                colorPalette: {
                    type: "object",
                    properties: {
                        primary: { type: "string", description: "Main brand color (Hex code, e.g. #FF5733)" },
                        secondary: { type: "string", description: "Supporting color (Hex code)" },
                        background: { type: "string", description: "Page background color (Hex code)" },
                        text: { type: "string", description: "Main text color (High contrast with background)" },
                        accent: { type: "string", description: "Highlight/Action color (Hex code)" }
                    },
                    required: ["primary", "secondary", "background", "text", "accent"]
                },
                layoutMode: {
                    type: "string",
                    enum: ["standard", "split_screen", "bento_grid"],
                    description: "Overall layout mode"
                },
                heroContent: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "Catchy main title (max 10 words)" },
                        subtitle: { type: "string", description: "Short description" },
                        buttonText: { type: "string" }
                    }
                },
                activeSections: {
                    type: "array",
                    items: { type: "string", enum: ["products", "story", "album", "contact"] },
                    description: "Order of sections to display"
                },
                responseMessage: {
                    type: "string",
                    description: "A friendly, creative response to the user explaining the artistic choice of this palette in Vietnamese."
                }
            },
            required: ["colorPalette", "layoutMode", "heroContent", "activeSections", "responseMessage"]
        }
    }
};

// 2. API ENDPOINT
router.post('/design-chat', async (req, res) => {
    try {
        const { userRequest } = req.body;
        const aiConfig = getOpenAI();

        if (!aiConfig) {
            return res.json({
                type: 'message',
                message: "SYSTEM: GROQ_API_KEY or OPENAI_API_KEY is missing. Please configure backend .env"
            });
        }

        const { client, model } = aiConfig;

        const completion = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: `You are a professional UI/UX Designer. 
          Task: Listen to user ideas and use the 'update_website_design' tool to redesign the website with a custom COLOR PALETTE.
          
          *** COLOR THEORY INSTRUCTIONS ***
          You are not limited to fixed themes. You must GENERATE a custom 'colorPalette' (Hex codes) that matches the user's vibe perfectly.
          - If user says "Cyberpunk": Generate Neon Pink/Green on Dark background.
          - If user says "Coffee Shop": Generate Warm Browns, Beiges, and Cream.
          - If user says "Forest": Generate Deep Greens, Earthy Browns.
          - **Accessibility Rule**: Ensure 'text' color has HIGH CONTRAST against 'background'.
          - **Vietnamese Response**: Your 'responseMessage' must be in Vietnamese, explaining why you chose these colors.

          Component Definitions:
          - "contact": The Shop Info Card (Phone, Email, Address, Description). Often placed at the top.
          - "products": The Product Grid (Menu/Items). The core content.
          - "story": About Us / Brand Story section.
          - "album": Photo Gallery.

          Rules:
          1. **Layout Order**: The order of 'activeSections' EXACTLY determines the vertical order of components on the page.
          2. If user says "put contact info at the top", 'contact' MUST be the first item in 'activeSections'.
          3. Text content (title/subtitle) must match the requested topic.
          4. **Response Message**: Explain your design choices creatively in Vietnamese.
          `
                },
                { role: "user", content: userRequest }
            ],
            tools: [designToolDefinition],
            tool_choice: "auto"
        });

        const message = completion.choices[0].message;

        // Check if AI called the tool
        if (message.tool_calls) {
            const toolCall = message.tool_calls[0];
            if (toolCall.function.name === "update_website_design") {
                const newDesignConfig = JSON.parse(toolCall.function.arguments);

                return res.json({
                    type: 'design_update',
                    message: newDesignConfig.responseMessage || "I've updated the design for you! What do you think?",
                    config: newDesignConfig
                });
            }
        }

        // Normal chat
        res.json({
            type: 'message',
            message: message.content
        });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

export default router;
