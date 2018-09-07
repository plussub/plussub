import type from '../../redux/const.js';


class Bridge {
    constructor() {

        this.state = null;
        this.subscribers = [];
        this.foundedContentVideos = [];

        chrome.runtime.onMessage.addListener((request) => {
            if (request.sender !== "BackgroundBridge") {
                console.warn(`Receive message from ${request.sender}`);
                return;
            }

            if (request.command !== "NotifySubscriber") {
                console.warn(`Receive unprocessable command ${request.command}`);
            }

            //todo store video local, send id instead
            this.state = request.payload;

            //workaround for not serializable object like html5 video tag
            //used in content script.
            // Restore them from instance stored value

            this.state.videoMeta.currentVideos = this.foundedContentVideos;

            this.subscribers.forEach(fn => fn());

        });
    }

    async ready() {
        this.state = await this.sendMessage("InitialState");
    }

    async sendMessage(command, payload = {}) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                payload: payload,
                command: command,
                sender: 'UiElement'
            }, (response) => {
                resolve(response);
            });
        });
    }

    subscribe(cb) {
        if (!this.state || this.state.debug.messageBridge) {
            console.log(`subscribe: ${cb}`);
        }
        this.subscribers.push(cb);
        return () => {
            this.subscribers = this.subscribers.filter(x => cb.toString() === x.toString());
        }
    }

    dispatch(action) {

        if (action.type === type.content_found_video) {
            //workaround for not serializable object like html5 video tag
            //used in content script. Safe them as instance variable.
            this.foundedContentVideos.push(action.payload);
            action.payload = "<placeholder>";
        }

        if (this.state && this.state.debug.messageBridge) {
            console.log(`Dispatch action: \n ${JSON.stringify(action, null, 2)}`);
        }

        this.sendMessage("Dispatch", action);
    }

    getState() {
        return this.state;
    }
}


export default () => new Bridge();
