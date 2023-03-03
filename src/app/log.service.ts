export class LogService {

  constructor() { }

  log(logText:any) {
    console.log(logText);
  }

  error(logText:any) {
    console.error(logText);
  }
}
