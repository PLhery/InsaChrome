function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
if(inIframe()){

	chrome.storage.local.set({connect: "planete"});
	document.location.href="https://login.insa-lyon.fr/cas/login?service=https://planete.insa-lyon.fr/uPortal/Login";
	}