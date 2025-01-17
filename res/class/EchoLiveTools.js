class EchoLiveTools {
    constructor() {}

    static getUUID() {
        let timestamp = new Date().getTime();
        let perforNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let random = Math.random() * 16;
            if (timestamp > 0) {
                random = (timestamp + random) % 16 | 0;
                timestamp = Math.floor(timestamp / 16);
            } else {
                random = (perforNow + random) % 16 | 0;
                perforNow = Math.floor(perforNow / 16);
            }
            return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
        });
    };

    static messageStyleGenerator(data) {
        let cls = '';
        if (data?.class) {
            cls = data.class + ' ';
        }
        let style = '';
        if (data?.typewrite) cls += 'echo-text-typewrite '
        if (data?.style) {
            if (data.style?.color) style += `color: ${data.style.color}; --echo-span-color: ${data.style.color}; `;
            if (data.style?.bold) cls += 'echo-text-bold '
            if (data.style?.italic) cls += 'echo-text-italic '
            if (data.style?.underline) cls += 'echo-text-underline '
            if (data.style?.strikethrough) cls += 'echo-text-strikethrough '
            if (data.style?.rock) cls += 'echo-text-rock-' + data.style.rock + ' '
            if (data.style?.style) style += data.style.style;
        }

        return {
            class: cls,
            style: style
        }
    }

    static getMessagePlainText(message) {
        if (typeof message == 'string') return message;
        if (typeof message == 'object' && !Array.isArray(message)) return message?.text;
        if (!Array.isArray(message)) return;

        let str = '';
        message.forEach(e => {
            if (typeof e == 'string') {
                str += e;
            } else {
                str += e.text;
            }
        });

        return str;
    }

    static getMessageSendLog(message, username = '') {
        if (typeof message != 'string') message = EchoLiveTools.getMessagePlainText(message);
        if (message == '') message = '<i>[空消息]</i>';
        if (username == '') username = '<i>[未指定说话人]</i>';

        return `<${username}> ${message}`;
    }

    static formattingCodeToMessage(text) {
        let message = [];

        function msgPush(msg = '', style = undefined) {
            msg = msg.replace(/{{{sheep-realms:at}}}/g, '@');
            if (style == undefined) return message.push(msg);
            return message.push({
                text: msg,
                style: style
            });
        }

        let replaced = text;
        replaced = replaced.replace(/\\@/g, '{{{sheep-realms:at}}}');
        replaced = replaced.replace(/@(.?)/g, '{{{sheep-realms:split}}}@$1{{{sheep-realms:format}}}');

        let arrayMsg = replaced.split('{{{sheep-realms:split}}}');

        for (let i = 0; i < arrayMsg.length; i++) {
            arrayMsg[i] = arrayMsg[i].split('{{{sheep-realms:format}}}');
        }

        let styleCache = {};

        for (let i = 0; i < arrayMsg.length; i++) {
            const e = arrayMsg[i];
            if (e.length < 2) {
                msgPush(e[0]);
                continue;
            }

            let style = {};
            switch (e[0]) {
                case '@b':
                    style.bold = true
                    break;

                case '@i':
                    style.italic = true
                    break;

                case '@u':
                    style.underline = true
                    break;

                case '@s':
                    style.strikethrough = true
                    break;

                case '@r':
                    styleCache = {};
                    msgPush(e[1]);
                    continue;
            
                default:
                    msgPush(e[0] + e[1]);
                    continue;
            }
            styleCache = {...styleCache, ...style};

            if (e[1] != '') {
                style = {...styleCache, ...style};
                msgPush(e[1], style);
            }
        }

        return message;
    }
}