import { Bot } from "./Bot";
import storageInstance from "../js/storage";

export class TranslationBot extends Bot {
    messages = [];
    constructor(storageKey) {
      super('TranslationBot');
      this.commands = ['translateText', 'getLanguageCodes', 'getHelp'];
      this.apiUrl = 'https://translation.googleapis.com/language/translate/v2';
      this.apiKey = 'your_google_translate_api_key';
      this.messages = storageInstance.getMessages(storageKey);
    }
  
    async executeAction(content) {
      let apiUrl = this.apiUrl;
      let params = {};
  
      switch (action) {
        case 'translateText':
          const parts = messageText.match(/translate (.+) to (.+)/i);
          if (parts && parts.length === 3) {
            params = {
              q: parts[1],
              target: parts[2],
              key: this.apiKey
            };
          }
          apiUrl = `${this.apiUrl}?${new URLSearchParams(params)}`;
          break;
        case 'getLanguageCodes':
          apiUrl += `/languages?key=${this.apiKey}`;
          break;
        case 'getHelp':
          return `Available commands: ${Object.keys(this.commands).join(', ')}`;
        default:
          break;
      }
  
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
  
        switch (action) {
          case 'translateText':
            return `Translated text: ${data.data.translations[0].translatedText}`;
          case 'getLanguageCodes':
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        return `Error fetching data from ${this.name}. Please try again later.`;
      }
    }

    getMessages() {
      return storageInstance.getMessages(this.storageKey);
    }

    getActions() {
      return this.commands;
    }

    parseMessages() {
      return this.messages;
    }

    saveMessage() {
        storageInstance.saveMessage(this.storageKey);
    }
  }