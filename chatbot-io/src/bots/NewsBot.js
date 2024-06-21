import { Bot } from "./Bot";
import storageInstance from "../js/storage";

export class NewsBot extends Bot {
    messages = [];
    constructor(storageKey) {
      super('NewsBot');
      this.commands = ['getTopHeadlines', 'getNews', 'getHelp'];
      this.apiUrl = 'https://newsapi.org/v2/top-headlines';
      this.apiKey = 'your_newsapi_org_api_key';
      this.messages = storageInstance.getMessages(storageKey);
    }
  
    async executeAction(action, messageText) {
      let apiUrl = this.apiUrl;
      let params = {};
  
      switch (action) {
        case 'getTopHeadlines':
          apiUrl += `?country=us&apiKey=${this.apiKey}`;
          break;
        case 'getNews':
          const category = messageText.substr(5);
          apiUrl += `?country=us&category=${category}&apiKey=${this.apiKey}`;
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
          case 'getTopHeadlines':
            break;
          case 'getNews':
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