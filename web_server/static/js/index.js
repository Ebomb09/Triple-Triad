let client = new tt_client("ws://192.168.50.50:5001", onopen);

function onopen(){
	client.getGames();
}