function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
if(inIframe()){
	chrome.storage.local.set({connect: "zimbra"});
	document.location.href="https://login.insa-lyon.fr/zimbra/login?version=preferred";
	}