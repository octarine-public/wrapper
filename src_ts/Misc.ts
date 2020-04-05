import { EventsSDK, GameRules, Input, InputEventSDK, Menu as MenuSDK, MouseWheel, VKeys, Events, ExecuteOrder, DOTAGameUIState_t, RendererSDK, Tree, GameState } from "./wrapper/Imports"
import { SetGameInProgress } from "./wrapper/Managers/EventsHandler"

let Menu = MenuSDK.AddEntry("Misc")

let AutoAccept_delay = Menu.AddSlider("Delay on AutoAccept", 3, 0, 28 /* ?? is real maximum */),
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
	], 8).OnValue(caller => ConVars.Set("cl_weather", caller.selected_id)),
	map_name = Menu.AddSwitcher("Custom Map", [
		"dota",
		"dota_autumn",
		"dota_cavern",
		"dota_coloseum",
		"dota_desert",
		"dota_journey",
		"dota_jungle",
		"dota_reef",
		"dota_spring",
		"dota_summer",
		"dota_winter",
		"dota_719",
		"dota_706",
		"dota_688",
		"dota_685",
		"dota_vr",
	], 0),
	tree_model = Menu.AddSwitcher("Tree Model", [
		"Default",
		"Crystal",
		"Pumpkins #1",
		"Pumpkins #2",
		"Pumpkin Buckets",
		"Stumps",
	], 0),
	tree2origmodel = new Map<Tree, [string, number]>(),
	tree2modelid = new Map<Tree, number>()

let tree_models: [string, number][] = [
	["", 1],
	["models/props_structures/crystal003_refract.vmdl", 1],
	["models/props_structures/pumpkin001.vmdl", 1.08],
	["models/props_structures/pumpkin003.vmdl", 3],
	["models/props_gameplay/pumpkin_bucket.vmdl", 1],
	["maps/journey_assets/props/trees/journey_armandpine/journey_armandpine_02_stump.vmdl", 4.5],
]
tree_model.OnValue(self => SetTreeModel(...tree_models[self.selected_id]))

CamDist.OnValue(UpdateVisuals)

let keybind = Menu.AddKeybind("Menu (Open/Close)", "Insert").OnPressed(() => MenuSDK.MenuManager.is_open = !MenuSDK.MenuManager.is_open)
keybind.activates_in_menu = true
keybind.trigger_on_chat = true
Menu.AddToggle("Trigger keybinds in chat", false).OnValue(toggle => MenuSDK.MenuManager.trigger_on_chat = toggle.value)
Menu.AddToggle("Alternate WorldToScreen", false).OnValue(toggle => RendererSDK.AlternateW2S = toggle.value)
Menu.AddToggle("Team chat mute fix", false).OnValue(toggle => ToggleFakeChat(toggle.value))
Menu.AddToggle("Disable loadscreens", false).OnValue(toggle => ToggleLoadScreen(!toggle.value))
let humanizer = Menu.AddNode("Humanizer")
humanizer.AddToggle("wait_next_usercmd", false).OnValue(toggle => ExecuteOrder.wait_next_usercmd = toggle.value)
humanizer.AddToggle("wait_near_cursor", false).OnValue(toggle => ExecuteOrder.wait_near_cursor = toggle.value)
humanizer.AddToggle("debug_orders", false).OnValue(toggle => ExecuteOrder.debug_orders = toggle.value)
humanizer.AddToggle("debug_draw", false).OnValue(toggle => ExecuteOrder.debug_draw = toggle.value)

declare global {
	var reload: () => void
}

function ReloadScripts() {
	SetGameInProgress(false)
	reload()
}

Menu.AddButton("Reload Scripts").OnValue(ReloadScripts)
Menu.AddKeybind("Reload keybind").OnPressed(ReloadScripts)

CameraTree.AddButton("Reset camera").OnValue(() => {
	Camera.Distance = CamDist.value = 1200
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

let c = 0
EventsSDK.on("Draw", () => {
	if (c++ < 3)
		return
	UpdateVisuals()
	c = 0
})

InputEventSDK.on("MouseWheel", wheel => {
	if (!CamMouseState.value || !GameRules?.IsInGame
		|| GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return

	if (CamMouseStateCtrl.value && !Input.IsKeyDown(VKeys.CONTROL))
		return

	let camDist = CamDist.value

	if (wheel === MouseWheel.DOWN)
		camDist += CamStep.value
	else
		camDist -= CamStep.value

	CamDist.value = Math.min(Math.max(camDist, CamDist.min), CamDist.max)

	MenuSDK.MenuManager.UpdateConfig()
	UpdateVisuals()
	return false
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

let timeCreate = -1
Events.on("SharedObjectChanged", (id, reason, uuid, obj) => {
	if (id !== 2004)
		return

	let lobby = obj as CSODOTALobby

	if (lobby.state === CSODOTALobby_State.READYUP && timeCreate === -1)
		timeCreate = hrtime()
	else if (lobby.state !== CSODOTALobby_State.READYUP && timeCreate !== -1)
		timeCreate = -1
})

EventsSDK.on("Draw", () => {
	if (timeCreate === -1)
		return

	let elepsedTime = (hrtime() - timeCreate) / 1000

	if (elepsedTime > AutoAccept_delay.max) {
		timeCreate = -1
		return
	}

	if (AutoAccept_delay.value - elepsedTime > 0)
		return

	AcceptMatch()
	timeCreate = -1
})

let guard = false,
	clear_list: string[] = []
Events.on("AddSearchPath", path => {
	if (!guard) {
		if (map_name.selected_id !== 0 && path.endsWith("dota.vpk")) {
			guard = true
			AddSearchPath(path)
			let new_path = path.substring(0, path.length - 8) + map_name.values[map_name.selected_id] + ".vpk"
			AddSearchPath(new_path)
			clear_list.push(new_path)
			guard = false
			return false
		}
		if (map_name.values.some((name, i) => i !== 0 && path.endsWith(name + ".vpk")))
			return false
	}
	return true
})

Events.on("PostRemoveSearchPath", path => {
	if (path.endsWith("dota.vpk"))
		clear_list.forEach(path_ => RemoveSearchPath(path_))
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Tree) {
		tree2modelid.delete(ent)
		tree2origmodel.delete(ent)
	}
})
