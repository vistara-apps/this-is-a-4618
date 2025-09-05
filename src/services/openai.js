import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key missing. AI features will not work.');
}

const openai = new OpenAI({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

export const aiService = {
  // Generate dynamic rights content based on location and scenario
  generateRightsContent: async (state, scenario, language = 'english') => {
    try {
      const prompt = `Generate a concise, accurate legal rights guide for ${state} state in the United States for the scenario: ${scenario}. 
      
      Please provide:
      1. A brief summary of key rights (3-4 bullet points)
      2. Important "don'ts" or things to avoid (3-4 bullet points)
      3. A suggested script for communicating with law enforcement
      
      Language: ${language}
      Format: JSON with keys: rightsSummary, donts, script
      
      Keep it practical, accurate, and easy to understand. Focus on constitutional rights and state-specific considerations.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal expert providing accurate, practical advice about constitutional rights and police interactions. Always emphasize remaining calm, respectful, and safe."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      });

      const content = response.choices[0]?.message?.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating rights content:', error);
      throw new Error('Failed to generate rights content');
    }
  },

  // Generate personalized scripts for different scenarios
  generateScript: async (scenario, state, language = 'english', userPreferences = {}) => {
    try {
      const prompt = `Generate a professional, respectful script for communicating with law enforcement during a ${scenario} in ${state}. 
      
      Language: ${language}
      User preferences: ${JSON.stringify(userPreferences)}
      
      The script should:
      - Assert constitutional rights clearly
      - Remain respectful and non-confrontational
      - Be appropriate for the specific scenario
      - Include key phrases for de-escalation
      
      Return only the script text, no additional formatting.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal communication expert. Create scripts that protect rights while maintaining safety and respect."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.2
      });

      return response.choices[0]?.message?.content?.trim();
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate script');
    }
  },

  // Analyze incident report and suggest improvements
  analyzeIncidentReport: async (reportText, state) => {
    try {
      const prompt = `Analyze this police interaction incident report and provide constructive feedback:

      Report: ${reportText}
      State: ${state}
      
      Please provide:
      1. Key observations about the interaction
      2. Rights that were properly exercised
      3. Areas for improvement in future interactions
      4. Relevant legal considerations for ${state}
      
      Format as JSON with keys: observations, rightsExercised, improvements, legalConsiderations
      
      Be supportive and educational, not critical.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a supportive legal educator helping people learn from their experiences with law enforcement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.4
      });

      const content = response.choices[0]?.message?.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error analyzing incident report:', error);
      throw new Error('Failed to analyze incident report');
    }
  },

  // Generate summary card content for sharing
  generateSummaryCard: async (incidentData) => {
    try {
      const prompt = `Create a professional, shareable summary of this police interaction incident:

      ${JSON.stringify(incidentData)}
      
      Generate a concise summary suitable for sharing with legal counsel, family, or advocacy groups. Include:
      - Date, time, and location
      - Key details of the interaction
      - Rights exercised
      - Outcome
      
      Keep it factual and professional. Return as plain text, well-formatted.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional legal documentation assistant creating clear, factual summaries."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.1
      });

      return response.choices[0]?.message?.content?.trim();
    } catch (error) {
      console.error('Error generating summary card:', error);
      throw new Error('Failed to generate summary card');
    }
  }
};
