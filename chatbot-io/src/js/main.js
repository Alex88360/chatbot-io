import { WeatherBot, NewsBot, TranslationBot } from "../bots";
import { Message } from './message';
import storageInstance from "./storage";


export class Chat {
  constructor() {
    this.bots = {
      weather: new WeatherBot("weather-bot"),
      news: new NewsBot("news-bot"),
      translation: new TranslationBot("translation-bot")
    };
    this.messageInput = document.getElementById('message-input');
    this.sendButton = document.getElementById('send-button');
    this.chatWindow = document.getElementById('messages-container');
    this.selectActions = document.getElementById("select-actions");
    this.activeChat = "weather";
  }

  init() {
    this.loadMessages();
    this.loadActions();
    this.addEventListeners();
    this.scrollToEnd();
  }

  loadActions() {
    const activeBot = this.getActiveBot();
    const actions = activeBot.getActions();

    const options = actions.map(action => this.buildOption(action));
    this.selectActions.replaceChildren(...options);
  }

  buildOption(action) {
    const option = document.createElement("option");
    option.value = action;
    option.innerHTML = action;

    return option;
  }

  loadMessages() {
    const activeBot = this.getActiveBot();
    const parsedMessages = activeBot.parseMessages(activeBot.getMessages());
    console.log("messages", parsedMessages);
    this.displayMessages(parsedMessages);
  }

  addEventListeners() {
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.messageInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.sendMessage();
      }
    });

    document.querySelectorAll(".bot-item").forEach(botElement => {
      botElement.addEventListener("click", (event) => {
        event.stopImmediatePropagation();
        this.setActiveChat(botElement.dataset.bot);
        this.loadMessages();
        this.loadActions();
      })
    })
  }

  sendMessage() {
    const content = this.messageInput.value.trim();
    if (content) {
      const message = new Message('Me', content, new Date(), 'sent');
      const activeBot = this.bots[this.activeChat];
      activeBot.saveMessage(message);
      const parsedMessages = activeBot.parseMessages(activeBot.getMessages());
      this.displayMessages(parsedMessages);
      this.messageInput.value = '';
      const currentAction = this.selectActions.value;
      this.handleBotResponse(currentAction, content);
    }
  }

  displayMessage(message) {
    console.log("time", typeof message.time);
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', message.type);
    messageElement.innerHTML = `
      <img src="https://via.placeholder.com/30" class="avatar" alt="avatar">
      <div class="content">
        <strong>${message.sender}</strong><br>
        <span>${message.content}</span><br>
        <small>${message.time.toLocaleTimeString()}</small>
      </div>
    `;
    return messageElement;
  }

  displayMessages(messages) {
    console.log("messages", messages);
    const messageElements = messages.map(message => this.displayMessage(message));
    console.log("elements", messageElements);
    this.chatWindow.replaceChildren(...messageElements);
  }

  setActiveChat(chat) {
    this.activeChat = chat;
    console.log("active chat", this.activeChat);
    switch(chat) {
      case "weather": {
        const lastActiveChat = document.querySelector(".active");
        lastActiveChat.classList.remove("active");
        const chatToSetActive = document.querySelector(`div[data-bot="${chat}"]`);
        chatToSetActive.classList.add("active");
      }
      case "news": {
        const lastActiveChat = document.querySelector(".active");
        lastActiveChat.classList.remove("active");
        const chatToSetActive = document.querySelector(`div[data-bot="${chat}"]`);
        chatToSetActive.classList.add("active");
        console.log("chat update", chatToSetActive, lastActiveChat, this.activeChat);
      }
      case "translation": {
        const lastActiveChat = document.querySelector(".active");
        lastActiveChat.classList.remove("active");
        const chatToSetActive = document.querySelector(`div[data-bot="${chat}"]`);
        chatToSetActive.classList.add("active");
      }
    }
  }

  getActiveBot() {
    return this.bots[this.activeChat];
  }

  async handleBotResponse(action, content) {
    const activeBot = this.bots[this.activeChat];
    console.log("activeBot", activeBot, this.bots, this.activeChat);
    const response = await activeBot.executeAction(action, content);
    const message = new Message(activeBot.name, response, new Date(), 'received');
    activeBot.saveMessage(message);
    const parsedMessages = activeBot.parseMessages(activeBot.getMessages());
    console.log("parsedMessages", parsedMessages);
    this.displayMessages(parsedMessages);
  }

  scrollToEnd() {
    this.chatWindow.scrollTop = this.chatWindow.scrollHeight + 100;
  }
}
