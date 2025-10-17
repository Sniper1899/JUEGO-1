import { GoogleGenAI, Type } from "@google/genai";
import { SmartPhaseKey, SmartPlan } from '../types';

// Fix: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// Fix: Use a recommended model for text generation tasks.
const model = 'gemini-2.5-flash';

const phaseExplanations = {
    S: "Specific (Específico): ¿Qué quieres lograr exactamente? Sé claro y detallado.",
    M: "Measurable (Medible): ¿Cómo sabrás que lo has logrado? Define métricas o hitos concretos.",
    A: "Achievable (Alcanzable): ¿Es este objetivo realista con tus recursos y tiempo actuales? ¿Qué pasos debes seguir?",
    R: "Relevant (Relevante): ¿Por qué es importante este objetivo para ti? ¿Cómo se alinea con tus valores y metas a largo plazo?",
    T: "Time-bound (Temporal): ¿Para cuándo quieres lograrlo? Establece una fecha límite clara.",
};

export async function generateQuestion(phase: SmartPhaseKey, userGoal: string, smartPlan: SmartPlan): Promise<string> {
    const completedPhases = Object.entries(smartPlan)
        .filter(([, value]) => value !== null)
        .map(([key, value]) => `- ${phaseExplanations[key as SmartPhaseKey]}: ${value}`)
        .join('\n');

    const prompt = `
Eres S.A.T., un sistema de inteligencia artificial que ayuda a los agentes a transformar sus metas en planes de acción usando la metodología S.M.A.R.T. Tu tono es como el de una IA de una película de espías: directo, profesional y enfocado en la misión.

**Misión Actual:**
- **Objetivo del Agente:** "${userGoal}"
- **Fase Actual del Protocolo S.M.A.R.T.:** ${phaseExplanations[phase]}

**Progreso hasta ahora:**
${completedPhases || "Ninguno. Esta es la primera fase."}

**Tu Tarea:**
Formula una pregunta clara y directa para guiar al agente a definir la fase **${phaseExplanations[phase]}** de su objetivo. La pregunta debe ser motivadora y mantener el tono de la misión. No te repitas si ya hay información. Haz solo una pregunta. No añadas introducciones como "Claro, aquí tienes una pregunta". Ve directo al grano.
`;

    try {
        // Fix: Use ai.models.generateContent to generate text.
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        // Fix: Extract text from the response using the .text property.
        return response.text;
    } catch (error) {
        console.error("Error generating question:", error);
        return "Error de conexión con el sistema S.A.T. Intenta de nuevo.";
    }
}


export async function analyzeResponse(phase: SmartPhaseKey, userGoal: string, answer: string): Promise<{ approved: boolean; feedback: string; }> {
    const analysisPrompt = `
Eres S.A.T., un sistema de inteligencia artificial experto en la metodología S.M.A.R.T. Tu rol es analizar la respuesta de un agente y determinar si cumple con los criterios de la fase actual. Eres estricto pero justo.

**Contexto de la Misión:**
- **Objetivo General del Agente:** "${userGoal}"
- **Fase del Protocolo a Evaluar:** ${phaseExplanations[phase]}
- **Respuesta del Agente a Evaluar:** "${answer}"

**Tu Tarea:**
1.  **Analiza** si la respuesta del agente define clara y efectivamente la fase **${phaseExplanations[phase]}** para su objetivo.
2.  **Decide** si la respuesta es 'aprobada' (cumple el criterio) o 'rechazada' (necesita mejorar).
3.  **Genera feedback:**
    *   Si es **aprobada**, felicita al agente de forma concisa y profesional (ej. "Excelente. Objetivo fijado.") y explica brevemente por qué su respuesta es buena.
    *   Si es **rechazada**, explica claramente por qué no cumple el criterio y dale una **pista específica** o una pregunta para que pueda mejorarla. No le des la respuesta directamente. Mantén el tono de IA de espionaje.

**Formato de Salida:**
Responde únicamente con un objeto JSON con la siguiente estructura:
{
  "approved": boolean,
  "feedback": "string con tu análisis y consejo"
}
`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            approved: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
        },
        required: ['approved', 'feedback'],
    };

    try {
        // Fix: Use ai.models.generateContent with JSON response configuration.
        const response = await ai.models.generateContent({
            model,
            contents: analysisPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        
        // Fix: Per docs, response.text contains the JSON string.
        const jsonStr = response.text.trim();
        const jsonResponse = JSON.parse(jsonStr);
        return jsonResponse;

    } catch (error) {
        console.error("Error analyzing response:", error);
        return {
            approved: false,
            feedback: "Error de comunicación con la unidad de análisis. No se pudo procesar la respuesta. Revisa tu conexión y vuelve a intentarlo."
        };
    }
}
