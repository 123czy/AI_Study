import { SYSTEM_PROMPT } from '@/AI/components/prompt'

interface AIConfig {
    provider: 'openai' | 'gemini';
    apiKey: string;
    apiUrl: string;
    modelName: string;
    englishLevel: string;
}

const createRequestBody = (config: AIConfig, scene: string, stream = true) => {
    const prompt = `Generate an English learning dialogue and chunks for the following scene: ${scene}`;

    if (config.provider === 'openai') {
        return {
            model: config.modelName,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT(config.englishLevel) },
                { role: 'user', content: prompt }
            ],
            stream
        };
    } else {
        return {
            contents: [
                {
                    parts: [
                        { text: SYSTEM_PROMPT(config.englishLevel) + "\n\nUser: " + prompt }
                    ]
                }
            ]
        };
    }
};