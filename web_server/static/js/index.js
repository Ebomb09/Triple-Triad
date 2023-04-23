let client = new tt_client(url, onOpen);

const settingsAlert = document.getElementById("settings-alert");

const inputName = document.getElementById("input-name");
inputName.value = getCookie("name", "New Player");

function onOpen(){
	client.listGames(onListGames);
}

function onSettingsUpdate(){
	let name = inputName.value;

	if(name.length > 0){
		setCookie("name", name);

		settingsAlert.innerHTML += `
			<div class="alert alert-success alert-dismissible" role="alert">
		       <div> Saved Settings! </div>
		       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		    </div>
	    `;
	
	}else{
		settingsAlert.innerHTML += `
			<div class="alert alert-warning alert-dismissible" role="alert">
		       <div> Player Name must be entered </div>
		       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		    </div>
	    `;		
	}
}

function onListGames(games){
	const table = document.getElementById("loaded-games");
	table.innerHTML = "";

	games.forEach((game) => {

		// Create a list of all players in game or watching
		let players = "<ul class='list-group list-group-flush'>";
		game.players.forEach((who) => {
			players += `<li class='list-group-item'>${who.name}</li>`;
		});
		players += "</ul>";

		table.innerHTML += `
			<tr>
				<td> <a class="btn btn-link" href="join?code=${game.code}"> ${game.code} </a> </td>
				<td> ${players} </td>
				<td> ${game.spectators} </td>
			</tr>
		`;
	});
}

function onCreateGame(code){
	location.href = `join?code=${code}`;
}