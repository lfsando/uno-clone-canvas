var Logger = (function () {
    function Logger(textarea) {
        this.textarea = textarea;
    }
    Logger.prototype.log = function (msg) {
        this.textarea.innerHTML += msg + '\n';
        this.textarea.scrollTop = this.textarea.scrollHeight;
        return msg;
    };
    return Logger;
}());
var logger = new Logger(document.getElementById('log'));
//# sourceMappingURL=logger.js.map