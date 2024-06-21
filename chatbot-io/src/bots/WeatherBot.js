import { Bot } from "./Bot";
import storageInstance from "../js/storage";

export class WeatherBot extends Bot {
    messages = [];
    constructor(storageKey) {
      super('WeatherBot');
      this.commands = ['getWeather', 'getForecast', 'getHelp'];
      this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
      this.apiKey = 'bcfbad1cdd24a01f2c306d7b1a3383be';
      console.log("storage instance", storageInstance);
      this.storageKey = storageKey;
    }
  
    async executeAction(action, message) {
      let apiUrl = this.apiUrl;

      switch (action) {
        case 'getWeather':
          apiUrl += `?q=${encodeURIComponent(message)}&appid=${this.apiKey}&units=metric`;
          break;
        case 'getForecast':
          apiUrl += `?q=${encodeURIComponent(message)}&appid=${this.apiKey}&units=metric`;
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
        console.log("data", data);
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return `Error fetching data from ${this.name}. Please try again later.`;
      }
    }

    parseMessage(message) {
      let content = message.content;

      if (message.type === "received") {
        const {
          coord: { lon, lat },
          weather: [{ main, description, icon }],
          main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
          visibility,
          wind: { speed, deg, gust },
          clouds: { all: cloudiness },
          sys: { country, sunrise, sunset },
          name: cityName
        } = content;

        const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(sunset * 1000).toLocaleTimeString();

        content = `
        Weather report for ${cityName}, ${country}:\r\n
        
        Coordinates: (${lat}, ${lon})\r\n
        
        Current Weather: ${main} (${description})\r\n
        Temperature: ${temp}°C (feels like ${feels_like}°C)\r\n
        Min Temperature: ${temp_min}°C\r\n
        Max Temperature: ${temp_max}°C\r\n
        Pressure: ${pressure} hPa\r\n
        Humidity: ${humidity}%\r\n
        
        Visibility: ${visibility} meters\r\n
        
        Wind: \r\n
          Speed: ${speed} m/s\r\n
          Direction: ${deg}°\r\n
          Gusts: ${gust} m/s\r\n
        
        Cloudiness: ${cloudiness}%\r\n
        
        Sunrise: ${sunriseTime}\r\n
        Sunset: ${sunsetTime}`;
      }

  
      return {
        ...message,
        time: new Date(message.time),
        content: content
      };
    }

    parseMessages(messages) {
      return messages.map(message => this.parseMessage(message));
    }

    getMessages() {
      return storageInstance.getMessages(this.storageKey);
    }

    getActions() {
      return this.commands;
    }

    saveMessage(message) {
       console.log("message", message, this.storageKey);
        storageInstance.saveMessage(this.storageKey, message);
    }
  }