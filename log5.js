function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
if(inIframe()){
	chrome.storage.local.set({connect: "ok"});
}