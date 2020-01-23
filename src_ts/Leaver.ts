import { Menu, EventsSDK, PlayerResource, Utils, GameState } from "wrapper/Imports"
import { RecursiveMap } from "./wrapper/Utils/ParseKV"

const tree = Menu.AddEntry(["Utility", "Bait leave"]),
	autodisconnect = tree.AddToggle("Auto Disconnect"),
	Additionaldelay = tree.AddSlider("Delay auto disconnect", 1, 1, 10),
	playersList = tree.AddSwitcher("Player ID", ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10"]),
	colors = ["#415fff", "#83ffda", "#c3009c", "#d5ff16", "#f16900", "#ff6ca5", "#85c83b", "#74d6f9", "#009e31", "#8f6f00"],
	gap = "<br>".repeat(75),
	Language = tree.AddSwitcher("Language", ["Russian", "English"]),
	button = tree.AddButton("Leave button"),
	heroes = [...(Utils.parseKVFile("scripts/npc/npc_heroes.txt").get("DOTAHeroes") as RecursiveMap).values()].filter(a => a instanceof Map) as RecursiveMap[]

let dc_time = 0
button.OnValue(() => {
	if (PlayerResource === undefined)
		return
	let PlayerID = playersList.selected_id

	let PlayerName = PlayerResource.PlayerData[PlayerID]?.Name ?? "",
		PlayerHeroID = (PlayerResource.PlayerTeamData[PlayerID]?.SelectedHeroID ?? 0).toString(),
		switch_language: string = ""

	let PlayerHero = heroes.find(hero => (hero.get("HeroID") as string) === PlayerHeroID)?.get("workshop_guide_name") ?? ""
	switch (Language.selected_id) {
		case 0:
			switch_language = `
<font color="${colors[PlayerID]}">${PlayerName} (${PlayerHero})</font> отключается от игры. Пожалуйста, дождитесь повторного подключения.<br><font color='#FF0000'>
<b>У <font color="${colors[PlayerID]}">${PlayerName} (${PlayerHero})</font> осталось 5 мин. для повторного подключения.</b></font>
<br> <font color="${colors[PlayerID]}">${PlayerName} (${PlayerHero})</font> покидает игру.<br><font color='#00FF00'><b>Теперь эту игру можно спокойно покинуть.</b></font>`
			break
		case 1:
			switch_language = `
<font color="${colors[PlayerID]}">${PlayerName} (${PlayerHero})</font> has disconnected from the game. Please wait for them to reconnect.<br><font color='#FF0000'>
<b> <font color="${colors[PlayerID]}">${PlayerName} (${PlayerHero})</font> has 5 minutes left to reconnect.</b></font>
<br> <font color="${colors[PlayerID]}">${PlayerName} (${PlayerHero})</font> has abandoned the game.<br><font color='#00FF00'><b>This game is now safe to leave.</b></font>`
			break
	}
	ChatWheelAbuse(gap + switch_language)

	if (autodisconnect.value)
		dc_time = hrtime()
})

EventsSDK.on("Draw", () => {
	if (dc_time === 0 || dc_time + Additionaldelay.value * 1000 > hrtime())
		return
	GameState.ExecuteCommand("disconnect")
	dc_time = 0
})
