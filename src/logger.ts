class Logger {
  textarea: HTMLTextAreaElement
  constructor(textarea: HTMLTextAreaElement) {
    this.textarea = textarea;
  }

  log(msg: string | number) {
    this.textarea.innerHTML += msg + '\n';
    this.textarea.scrollTop = this.textarea.scrollHeight;
    return msg
  }
}
const logger: Logger = new Logger(<HTMLTextAreaElement>document.getElementById('log'));