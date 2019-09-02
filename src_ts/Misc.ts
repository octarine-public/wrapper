import { EventsSDK, Game, Menu as MenuSDK } from "./wrapper/Imports"
function Language(ru: string, en: string) {
	return Game.Language === "russian" ? ru : en;
}
let Menu = MenuSDK.AddEntry("Misc")

let CameraTree = Menu.AddNode(Language("Камера", "Camera")),
	CamDist = CameraTree.AddSliderFloat(Language("Дистация камеры", "Camera Distance") , 1300, 0, 10000).OnValue(caller => {
		ConVars.Set("r_farz", caller.value * 2)
		if (Game.IsInGame)
			Camera.Distance = caller.value
	}),
	CamMouseTree = CameraTree.AddNode(Language("Колёсико мыши", "Mouse wheel")),
	CamMouseState = CamMouseTree.AddToggle(Language("Включить", "Active")),
	CamStep = CamMouseTree.AddSliderFloat(Language("Шаг камеры", "Camera Step"), 50, 10, 1000),
	Weather = Menu.AddSwitcher(Language("Погода", "Weather"), [
		"Default",
		"Snow",
		"Rain",
		"Moonbeam",
		"Pestilence",
		"Harvest",
		"Sirocco",
		"Spring",
		"Ash",
		"Aurora",
	], 8).OnValue(caller => ConVars.Set("cl_weather", caller.selected_id));
	
Menu.AddKeybind(Language("Меню (Открыть / Закрыть)", "Menu (Open / Close)"), "Insert").OnPressed(() => MenuSDK.MenuManager.is_open = !MenuSDK.MenuManager.is_open).activates_in_menu = true

Menu.AddButton(Language("Перезагрузить скрипты", "Reload Scripts")).OnValue(() => {
	EventsSDK.emit("GameEnded", false)
	global.reload("eTE9Te5rgBYThsO", true)
})

CameraTree.AddButton(Language("Сбросить камеру", "Reset camera")).OnValue(() => {
	Camera.Distance = CamDist.value = 1134
	ConVars.Set("r_farz", -1)
})


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

EventsSDK.on("WndProc", (msg, wParam) => {
	if (CamMouseState.value){
		if (wParam === 7864320n) {	
			console.log(CamDist.value)
			let cam = Camera.Distance = CamDist.value -= CamStep.value
			ConVars.Set("r_farz", cam * 2)
			return true
		}
		if (wParam === 4287102976n) {
			console.log(CamDist.value)
			let cam = Camera.Distance = CamDist.value += CamStep.value
			ConVars.Set("r_farz", cam * 2)
			return true
		}
		return true
	}
})
