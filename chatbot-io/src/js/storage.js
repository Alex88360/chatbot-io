class Storage {
  constructor() {
    if (Storage.instance) {
      return Storage.instance;
    }

    Storage.instance = this;
  }

  static getInstance() {
    return Storage.instance || new Storage();
  }

  getMessages(storageKey) {
    const messages = localStorage.getItem(storageKey);
    console.log("messages", messages);
    const parsedMessages = messages ? JSON.parse(messages) : [];
    console.log("parsedMessages", parsedMessages);
    return parsedMessages.map(message => ({ ...message, time: new Date(message.time)}));
  }

  saveMessage(storageKey, message) {
    const messages = this.getMessages(storageKey);
    console.log("messages", messages);
    messages.push(message);
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }
}

const storageInstance = Storage.getInstance();

export default storageInstance;