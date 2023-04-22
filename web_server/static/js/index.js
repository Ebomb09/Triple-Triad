let client = new tt_client(url, onOpen);

function onOpen(){
	client.listGames(onListGames);
}

function onListGames(games){
	const table = document.getElementById("loaded-games");
	table.innerHTML = "";

	games.forEach((game) => {
		table.innerHTML += `
			<tr>
				<td> <a href="join?code=${game.code}"> ${game.code} </a> </td>
				<td> ${game.players} </td>
			</tr>
		`;
	});
}

function onCreateGame(code){
	location.href = `join?code=${code}`;
}