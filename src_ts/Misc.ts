import { EventsSDK, Game, Input, InputEventSDK, Menu as MenuSDK, MouseWheel, VKeys, Events, ExecuteOrder, DOTAGameUIState_t } from "./wrapper/Imports"

let Menu = MenuSDK.AddEntry("Misc");

let AutoAcceptTree = Menu.AddNode("Auto Accept"),
	AutoAccept_State = AutoAcceptTree.AddToggle("Auto Accept", true),
	AutoAccept_delay = AutoAcceptTree.AddSlider("Delay on accept", 5, 0, 42 /* 44 is real maximum */),
	CameraTree = Menu.AddNode("Camera"),
	CamDist = CameraTree.AddSlider("Camera Distance", 1300, 0, 10000),
	CamMouseTree = CameraTree.AddNode("Mouse wheel"),
	CamMouseState = CamMouseTree.AddToggle("Active"),
	CamMouseStateCtrl = CamMouseTree.AddToggle("Change if Ctrl is down"),
	CamStep = CamMouseTree.AddSlider("Camera Step", 50, 10, 1000),
	weather = Menu.AddSwitcher("Weather", [
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
	], 8).OnValue(caller => ConVars.Set("cl_weather", caller.selected_id))

CamDist.OnValue(UpdateVisuals)

let keybind = Menu.AddKeybind("Menu (Open/Close)", "Insert").OnPressed(() => MenuSDK.MenuManager.is_open = !MenuSDK.MenuManager.is_open)
keybind.activates_in_menu = true
keybind.trigger_on_chat = true
Menu.AddToggle("Trigger keybinds in chat", false).OnValue(toggle => MenuSDK.MenuManager.trigger_on_chat = toggle.value)
Menu.AddToggle("Team chat mute fix", false).OnValue(toggle => ToggleFakeChat(toggle.value))
let humanizer = Menu.AddNode("Humanizer")
humanizer.AddToggle("wait_next_usercmd", false).OnValue(toggle => ExecuteOrder.wait_next_usercmd = toggle.value)
humanizer.AddToggle("wait_near_cursor", false).OnValue(toggle => ExecuteOrder.wait_near_cursor = toggle.value)
humanizer.AddToggle("debug_orders", false).OnValue(toggle => ExecuteOrder.debug_orders = toggle.value)

function ReloadScripts() {
	EventsSDK.emit("GameEnded", false)
	global.reload("eTE9Te5rgBYThsO", true)
}

Menu.AddButton("Reload Scripts").OnValue(ReloadScripts)
Menu.AddKeybind("Reload keybind").OnPressed(ReloadScripts)

CameraTree.AddButton("Reset camera").OnValue(() => {
	Camera.Distance = CamDist.value = 1134
	ConVars.Set("r_farz", -1)
})

function UpdateVisuals() {
	Camera.Distance = CamDist.value
	ConVars.Set("r_farz", CamDist.value * 2)
	ConVars.Set("cl_weather", weather.selected_id)
	ConVars.Set("fog_enable", false)
	ConVars.Set("fow_client_nofiltering", false)
	ConVars.Set("dota_use_particle_fow", false)
	ConVars.Set("demo_recordcommands", false)
	ConVars.Set("dota_unit_orders_rate", 512)
}

setInterval(UpdateVisuals, 100)

InputEventSDK.on("MouseWheel", wheel => {
	if (!CamMouseState.value || !Game.IsInGame
		|| Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return;

	if (CamMouseStateCtrl.value && !Input.IsKeyDown(VKeys.CONTROL))
		return;

	let camDist = CamDist.value;

	if (wheel === MouseWheel.DOWN)
		camDist += CamStep.value;
	else
		camDist -= CamStep.value;

	CamDist.value = Math.min(Math.max(camDist, CamDist.min), CamDist.max);

	MenuSDK.MenuManager.UpdateConfig()
	UpdateVisuals()
	return false;
})

enum CSODOTALobby_State {
	UI = 0,
	READYUP = 4,
	SERVERSETUP = 1,
	RUN = 2,
	POSTGAME = 3,
	NOTREADY = 5,
	SERVERASSIGN = 6,
}

interface CSODOTALobby {
	state: CSODOTALobby_State
}

let timeCreate = -1;

function waitAcceptOn() {
	if (timeCreate === -1) {
		return;
	}

	let elepsedTime = (Date.now() - timeCreate) / 1000;

	if (elepsedTime > AutoAccept_delay.max) {
		timeCreate = -1;
		return;
	}

	if (!AutoAccept_State.value || AutoAccept_delay.value - elepsedTime > 0) {
		return setTimeout(waitAcceptOn, 0);
	}

	AcceptMatch()
}

Events.on("SharedObjectChanged", (id, reason, uuid, obj) => {
	if (id !== 2004)
		return

	let lobby = obj as CSODOTALobby

	if (lobby.state === CSODOTALobby_State.READYUP && timeCreate === -1) {

		timeCreate = Date.now();
		waitAcceptOn();
	} else if (lobby.state !== CSODOTALobby_State.READYUP && timeCreate !== -1) {
		timeCreate = -1;
	}
})
