import { EventsSDK, Game, Menu as MenuSDK, RendererSDK } from "./wrapper/Imports"
import UserCmd from "./wrapper/Native/UserCmd"

let Menu = MenuSDK.AddEntry("Misc"),
	CameraMinDistance = 0,
	CameraMaxDistance = 10000,
	CameraDefaultDistance = 1300

let AutoAcceptTree = Menu.AddNode("Auto Accept"),
	AutoAccept_State = AutoAcceptTree.AddToggle("Auto Accept", true),
	AutoAccept_delay = AutoAcceptTree.AddSlider("Delay on accept", 5, 0, 42 /* 44 is real maximum */),
	CameraTree = Menu.AddNode("Camera"),
	CamDist = CameraTree.AddSlider("Camera Distance", CameraDefaultDistance, CameraMinDistance, CameraMaxDistance),
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

EventsSDK.on("WndProc", (msg, wParam) => {
	if (Game.IsInGame && msg === 522 /* WM_MOUSEWHEEL */ && CamMouseState.value) {
		let view = new DataView(new ArrayBuffer(64))
		view.setBigInt64(0, wParam)
		let val = view.getInt16(4),
			IsCtrlPressed = (view.getInt16(6) === 8)
		if (CamMouseStateCtrl.value && !IsCtrlPressed)
			return true
		if (val > -120)
			CamDist.value -= CamStep.value
		else if (val < 120)
			CamDist.value += CamStep.value
		CamDist.value = Math.min(Math.max(CamDist.value, CameraMinDistance), CameraMaxDistance)
		MenuSDK.MenuManager.UpdateConfig()
		UpdateVisuals()
		return false
	}
	return true
})

EventsSDK.after("Update", (cmd: UserCmd) => {
	let CursorWorldVec = cmd.VectorUnderCursor
	cmd.VectorUnderCursor = CursorWorldVec.SetZ(RendererSDK.GetPositionHeight(CursorWorldVec.toVector2()))
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

let old_state = CSODOTALobby_State.NOTREADY
Events.on("SharedObjectChanged", (id, reason, uuid, obj) => {
	if (id !== 2004 || !AutoAccept_State.value)
		return
	let lobby = obj as CSODOTALobby
	if (lobby.state === CSODOTALobby_State.READYUP && old_state !== CSODOTALobby_State.READYUP)
		setTimeout(() => {
			if (old_state === CSODOTALobby_State.READYUP)
				AcceptMatch()
		}, AutoAccept_delay.value * 1000)
	old_state = lobby.state
})
