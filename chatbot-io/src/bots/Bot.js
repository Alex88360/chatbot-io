export class Bot {
    constructor(name) {
      this.name = name;
      this.commands = {};
      this.commonCommand = 'hello';
    }
  
    handleCommonCommand() {
      return `${this.name} says hello!`;
    }
  
    async handleCommand(command, messageText) {
      if (command in this.commands) {
        const action = this.commands[command];
        return await this.executeAction(action, messageText);
      } else if (command === this.commonCommand) {
        return this.handleCommonCommand();
      } else {
        return `${this.name} doesn't understand that command.`;
      }
    }

    async executeAction(action, messageText) {
      throw new Error('executeAction method must be implemented by subclass');
    }
  }
  