let client = new tt_client(url, onopen);

function onopen(){
	client.getGames();
}