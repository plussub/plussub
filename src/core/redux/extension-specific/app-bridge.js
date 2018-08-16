/**
 * Created by stefa on 26.08.2017.
 */
var srtPlayer = srtPlayer || {};
srtPlayer.AppBridge = srtPlayer.AppBridge || ((store) => {

        let state;

        function sendMessage(command, payload = {}) {
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

        let subscribers = [];
        let foundedContentVideos = [];

        chrome.runtime.onMessage.addListener((request) => {
            if(request.sender !== "BackgroundBridge"){
                console.warn(`Receive message from ${request.sender}`);
                return;
            }

            if(request.command !== "NotifySubscriber"){
                console.warn(`Receive unprocessable command ${request.command}`);
            }

            //todo store video local, send id instead
            state = request.payload;

            //workaround for not serializable object like html5 video tag
            //used in content script.
            // Restore them from instance stored value

            state.videoMeta.currentVideos = foundedContentVideos;

            subscribers.forEach(fn => fn());

        });

        return {

            ready: () => {
                return (async () => {
                    state = await sendMessage("InitialState");
                })();
            },

            subscribe: (cb) => {
                if (!state || state.debug.messageBridge) {
                    console.log(`subscribe: ${cb}`);
                }
                subscribers.push(cb);

            },

            dispatch: (action) => {

                if(action.type === srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND){
                    //workaround for not serializable object like html5 video tag
                    //used in content script. Safe them as instance variable.

                    foundedContentVideos.push(action.payload);
                    action.payload = "<placeholder>";
                }

                if (state.debug.messageBridge) {
                    console.log(`Dispatch action: \n ${JSON.stringify(action, null, 2)}`);
                }


                sendMessage("Dispatch", action);
            },

            getState(){
                return state;
            }
        };

    });