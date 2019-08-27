import { EventsSDK, Game, Menu as MenuSDK } from "./wrapper/Imports"

let Menu = MenuSDK.AddEntry("Misc")
Menu.AddButton("Reload").OnValue(() => {
	EventsSDK.emit("GameEnded", false)
	global.reload("eTE9Te5rgBYThsO", true)
})
let CamDist = Menu.AddSliderFloat("Camera Distance", 1300, 0, 10000).OnValue(caller => {
	ConVars.Set("r_farz", caller.value * 2)
	if (Game.IsInGame)
		Camera.Distance = caller.value
})
let Weather = Menu.AddSwitcher("Weather", [
	"None",
	"Snow",
	"Rain",
	"Moonbeam",
	"Pestilence",
	"Harvest",
	"Sirocco",
	"Spring",
	"Ash",
	"Aurora",
], 8).OnValue(caller => ConVars.Set("cl_weather", caller.selected_id))
Menu.AddKeybind("Menu hotkey", "Insert").OnPressed(() => MenuSDK.MenuManager.is_open = !MenuSDK.MenuManager.is_open).activates_in_menu = true

EventsSDK.on("GameConnected", () => {
	// if (!enable_modifications)
	// 	return
	Camera.Distance = CamDist.value
	ConVars.Set("r_farz", CamDist.value * 2)
	ConVars.Set("cl_weather", Weather.selected_id)
	ConVars.Set("fog_enable", false)
	ConVars.Set("fow_client_nofiltering", false)
	ConVars.Set("dota_use_particle_fow", false)
	ConVars.Set("demo_recordcommands", false)
	ConVars.Set("dota_unit_orders_rate", 512)
})
