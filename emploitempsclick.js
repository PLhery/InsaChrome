		var evObj = document.createEvent('Events');
		evObj.initEvent("click", true, false);
		document.getElementsByName("form.button.Ok")[0].dispatchEvent(evObj);