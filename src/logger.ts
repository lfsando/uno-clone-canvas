export class Logger {
    textarea: HTMLTextAreaElement;

    constructor(textarea: HTMLTextAreaElement) {
        this.textarea = textarea;
    }

    public log(msg: string | number): string {
        this.textarea.innerHTML += `${msg}\n`;
        this.textarea.scrollTop = this.textarea.scrollHeight;
        return msg.toString();
    }
}
export const logger: Logger = new Logger(<HTMLTextAreaElement>document.getElementById('log'));
