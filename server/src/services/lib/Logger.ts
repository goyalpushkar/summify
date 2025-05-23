import * as fs from 'fs';
import * as path from 'path';

///home/user/studio/server/src/logs
const logsDir = path.join(__dirname, '../../logs');

class Logger {
  private logFilePath: string;
  private consoleLog: boolean = false;

  constructor(logFilePath: string = "", consoleLog: boolean = false) {
    this.logFilePath = this.getLogFilePath(logFilePath);
    this.consoleLog = consoleLog
    //"app.log"
    //this.getLogFilePath(logFilePath);
    this.ensureLogFileExists();
  }

  private getLogFilePath(logFilePath: string): string {
    if (path.isAbsolute(logFilePath)) {
        return path.join(logsDir, path.basename(logFilePath));
    } else {
        return path.join(logsDir, logFilePath.length > 0 ? logFilePath : "app.log");
    }
  }

  private ensureLogFileExists(): void {
    try {
        if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
        if (!fs.existsSync(this.logFilePath)) {
          fs.writeFileSync(this.logFilePath, '');
        }
    } catch (err) {console.error(`Error creating log file: ${err}`);}
  }

  private writeToFile(message: string): void {
    console.log(this.logFilePath)
    const timestamp = new Date(); ///.toISOString();
    timestamp.setTime(timestamp.getTime()+timestamp.getTimezoneOffset()*60*1000);
    var easternTimeOffset = -240; //for dayLight saving, Eastern time become 4 hours behind UTC thats why its offset is -4x60 = -240 minutes. So when Day light is not active the offset will be -300
    timestamp.setMinutes ( timestamp.getMinutes() + easternTimeOffset);

    const logMessage = `[${timestamp}] ${message}\n`;

    try {
      fs.appendFileSync(this.logFilePath, logMessage);
    } catch (err) {console.error(`Error writing to log file: ${err}`);}
  }

  private writeToConsole(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    try {
      if (this.consoleLog){
        console.log(logMessage);
      }
    } catch (err) {console.error(`Error writing to log file: ${err}`);}
  }

  // public log(message: string)

  log(message: string): void {
    this.writeToFile(`LOG: ${message}`);
    this.writeToConsole(`LOG: ${message}`);
  }

  info(message: string): void {
    this.writeToFile(`INFO: ${message}`);
    this.writeToConsole(`INFO: ${message}`);
  }

  error(message: string): void {
    this.writeToFile(`ERROR: ${message}`);
    this.writeToConsole(`ERROR: ${message}`);
  }

  debug(message: string): void {
    this.writeToFile(`DEBUG: ${message}`);
    this.writeToConsole(`DEBUG: ${message}`);
  }

  warn(message: string): void {
    this.writeToFile(`WARN: ${message}`);
    this.writeToConsole(`WARN: ${message}`);
  }

}

export default Logger;
;