import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

export const getOpenAI = () => {
    // Check multiple environment variable possibilities
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn("AI Warning: No API Key found (GROQ_API_KEY or OPENAI_API_KEY)");
        return null;
    }

    if (apiKey.startsWith('gsk_')) {
        return {
            client: new OpenAI({
                apiKey: apiKey,
                baseURL: "https://api.groq.com/openai/v1"
            }),
            model: "llama-3.3-70b-versatile",
            embeddingModel: null // Groq doesn't support embeddings well yet, we might need a fallback or fail gracefully
        };
    }

    return {
        client: new OpenAI({ apiKey }),
        model: "gpt-4o",
        embeddingModel: "text-embedding-3-small"
    };
};
