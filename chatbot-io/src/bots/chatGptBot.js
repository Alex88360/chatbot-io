import axios from 'axios';

export class ChatGPTBot {
  constructor() {
    this.name = 'ChatGPTBot';
    this.apiKey = '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';
  }

  async getResponse(content) {
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', {
        prompt: content,
        max_tokens: 150,
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
      return 'Sorry, something went wrong with ChatGPT.';
    }
  }
}
