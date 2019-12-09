import { EventsSDK, Game, Menu as MenuSDK, DOTA_GameState, LocalPlayer, Player } from "wrapper/Imports";

const Menu = MenuSDK.AddEntry(["Debugger", "SX.Utils"])
const MenuTreeColor = Menu.AddNode("Enemy color")
const range_display = Menu.AddSliderFloat("Range display", 0, 0, 10000)
const color_r = MenuTreeColor.AddSlider("R-Color", 1, 0, 100)
const color_g = MenuTreeColor.AddSlider("G-Color", 0, 0, 100)
const color_b = MenuTreeColor.AddSlider("B-Color", 0, 0, 100)
const State = Menu.AddToggle("State")
const BuybackBind = Menu.AddKeybind("Buyback key")
const StateAutoDisconnect = Menu.AddToggle("Auto disconnect after game", true)

color_r.OnValue((call) => {
	Game.ExecuteCommand("dota_enemy_color_r " + call.value)
})
color_g.OnValue((call) => {
	Game.ExecuteCommand("dota_enemy_color_g " + call.value)
})
color_b.OnValue((call) => {
	Game.ExecuteCommand("dota_enemy_color_b " + call.value)
})
range_display.OnValue((call) => {
	Game.ExecuteCommand("dota_range_display " + call.value)
})

const Server_log = "dota_log_server_connection"
const auto_pause_disconnect = "dota_pause_same_team_resume_time_disconnected"

// cmdrate 20-40 lock server
const cl_cmdrate = "cl_cmdrate", cl_updaterate = "cl_updaterate"

BuybackBind.OnRelease(() => {
	if (Player === undefined || LocalPlayer === undefined || LocalPlayer.Hero === undefined || LocalPlayer.Hero.IsAlive)
		return
	Player.Buyback()
})

EventsSDK.on("Tick", () => {
	if (!State.value)
		return
	if (ConVars.GetInt(Server_log) === 1) {
		Game.ExecuteCommand(Server_log + " 0")
	}
	if (ConVars.GetInt(cl_cmdrate) === 30) {
		Game.ExecuteCommand(cl_cmdrate + " 40")
	}
	if (ConVars.GetInt(cl_updaterate) === 30) {
		Game.ExecuteCommand(cl_updaterate + " 40")
	}
	if (ConVars.GetInt(auto_pause_disconnect) === 30) {
		Game.ExecuteCommand(auto_pause_disconnect + " 3")
	}
	if (StateAutoDisconnect.value && Game.GameState === DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME) {
		Game.ExecuteCommand("disconnect")
	}
})