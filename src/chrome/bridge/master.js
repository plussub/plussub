import {store} from '../../redux/redux.js'

class Bridge {
    constructor() {
        this.registeredTabs = new Set();
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (sender.tab) {
                console.log(`new tab registered: ${sender.tab.id}`);
                this.registeredTabs.add(sender.tab.id);
            }

            switch (request.command) {
                case "InitialState":
                    sendResponse(store.getState());
                    return;
                case "Dispatch":
                    store.dispatch(request.payload);
                    return;
                default:
                    return;
            }
        });

        store.subscribe(() => this.sendMessage("NotifySubscriber", store.getState()));
    }

    sendMessage(command, payload = {}) {
        chrome.runtime.sendMessage({
            payload: payload,
            command: command,
            sender: 'BackgroundBridge'
        });

        this.registeredTabs.forEach((tabId) => {
            chrome.tabs.sendMessage(tabId, {
                payload: payload,
                command: command,
                sender: 'BackgroundBridge'
            });
        });
    }
}

export default new Bridge();