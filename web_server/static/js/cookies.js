function getCookie(key, defaultValue){
	let found = "";

	document.cookie.split(";").forEach((cookie) => {

		let data = cookie.split("=");

		if(data.length == 2){
			if(data[0] == key)
				found = data[1];
		}
	});

	if(defaultValue !== undefined && found == ""){
		setCookie(key, defaultValue);
		return defaultValue;
	}

	return found;
}

function setCookie(key, value){
	let cookies = "";
	let added = false;

	document.cookie.split(";").forEach((cookie) => {

		let data = cookie.split("=");

		if(data.length == 2){
			
			if(data[0] == key){
				cookie = `${data[0]}=${value};`;
				added = true;
			}
		}
		cookies += cookie;
	});

	if(!added)
		cookies += `${key}=${value};`;

	document.cookie = cookies;
}