import { EventsSDK, GameRules, GameState, Menu as MenuSDK, DOTA_GameState, LocalPlayer, DOTAGameUIState_t, TickSleeper, Color, RendererSDK, Input, ExecuteOrder } from "wrapper/Imports"
declare global {
	var clear: CallableFunction
}
const Menu = MenuSDK.AddEntry(["Debugger", "SX.Utils"])
const State = Menu.AddToggle("State")
const MenuTreeColor = Menu.AddNode("Enemy color")
const range_display = Menu.AddSlider("Range display", 0, 0, 10000)
const color_r = MenuTreeColor.AddSlider("R-Color", 1, 0, 100)
const color_g = MenuTreeColor.AddSlider("G-Color", 0, 0, 100)
const color_b = MenuTreeColor.AddSlider("B-Color", 0, 0, 100)

const BuybackBind = Menu.AddKeybind("Buyback key")
const StateAutoDisconnect = Menu.AddToggle("Auto disconnect after game", true)

const DrawMosePosTree = Menu.AddNode("Draw mouse")
const DrawMosePos = DrawMosePosTree.AddToggle("Draw mouse position V3", true)
const mouse_color = DrawMosePosTree.AddColorPicker("R-Color", new Color(90, 255, 0, 255))
const mouse_size = DrawMosePosTree.AddSlider("Size", 19, 12, 64)

color_r.OnValue(call => {
	GameState.ExecuteCommand("dota_enemy_color_r " + call.value)
})
color_g.OnValue(call => {
	GameState.ExecuteCommand("dota_enemy_color_g " + call.value)
})
color_b.OnValue(call => {
	GameState.ExecuteCommand("dota_enemy_color_b " + call.value)
})
range_display.OnValue(call => {
	GameState.ExecuteCommand("dota_range_display " + call.value)
})

const Server_log = "dota_log_server_connection"
const auto_pause_disconnect = "dota_pause_same_team_resume_time_disconnected"
const draw_path = "dota_unit_draw_paths"
const draw_path_short = "dota_unit_short_path_search_debug"
//const draw_selection_boxes = "dota_unit_show_selection_boxes"
const draw_collision_radius = "dota_unit_show_collision_radius"
const draw__bounding_radius = "dota_unit_show_bounding_radius"

// cmdrate 20-40 lock server
const cl_cmdrate = "cl_cmdrate", cl_updaterate = "cl_updaterate"

let consoleClear = () => console.clear()

globalThis.clear = consoleClear

BuybackBind.OnRelease(() => {
	if (LocalPlayer === undefined || LocalPlayer.Hero === undefined || LocalPlayer.Hero.IsAlive)
		return
	ExecuteOrder.Buyback()
})

let Sleep = new TickSleeper()

let prees = false
Menu.AddKeybind("Full sven").OnRelease(() => {
	GameState.ExecuteCommand("dota_create_unit npc_dota_hero_sven enemy")
	prees = true
	Sleep.Sleep(1000 + GameState.Ping / 2)
})

State.OnDeactivate(() => {
	// if (ConVars.GetInt(draw_selection_boxes) !== 0)
	// 	GameState.ExecuteCommand(draw_selection_boxes + " 0")

	if (ConVars.GetInt(draw_collision_radius) !== 0)
		GameState.ExecuteCommand(draw_collision_radius + " 0")

	if (ConVars.GetInt(draw__bounding_radius) !== 0)
		GameState.ExecuteCommand(draw__bounding_radius + " 0")

	if (ConVars.GetInt(draw_path) !== 0)
		GameState.ExecuteCommand(draw_path + " 0")
})

EventsSDK.on("Tick", () => {
	if (!State.value)
		return

	if (prees) {
		for (var i = 6; i--;)
			GameState.ExecuteCommand("dota_bot_give_item item_heart")
		GameState.ExecuteCommand("dota_bot_give_level 30")
		if (!Sleep.Sleeping)
			prees = false
	}

	if (ConVars.GetInt(Server_log) === 1)
		GameState.ExecuteCommand(Server_log + " 0")

	if (ConVars.GetInt(draw_path_short) === 1)
		GameState.ExecuteCommand(Server_log + " 0")

	// if (ConVars.GetInt(draw_selection_boxes) !== 1)
	// 	GameState.ExecuteCommand(draw_selection_boxes + " 1")

	if (ConVars.GetInt(draw_collision_radius) !== 1)
		GameState.ExecuteCommand(draw_collision_radius + " 1")

	if (ConVars.GetInt(draw__bounding_radius) !== 1)
		GameState.ExecuteCommand(draw__bounding_radius + " 1")

	if (ConVars.GetInt(draw_path) !== 1)
		GameState.ExecuteCommand(draw_path + " 1")

	if (ConVars.GetInt(cl_cmdrate) === 30)
		GameState.ExecuteCommand(cl_cmdrate + " 40")

	if (ConVars.GetInt(cl_updaterate) === 30)
		GameState.ExecuteCommand(cl_updaterate + " 40")

	if (ConVars.GetInt(auto_pause_disconnect) === 30)
		GameState.ExecuteCommand(auto_pause_disconnect + " 3")

	if (StateAutoDisconnect.value && GameRules?.GameState === DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME)
		GameState.ExecuteCommand("disconnect")
})

EventsSDK.on("Draw", () => {
	if (!State.value || !GameRules?.IsInGame || GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || !DrawMosePos.value)
		return
	let MousePosition = Input.CursorOnWorld
	if (MousePosition.IsZero())
		return
	let text = Math.ceil(MousePosition.x) + ", " + Math.ceil(MousePosition.y) + ", " + Math.ceil(MousePosition.z)
	RendererSDK.TextAroundMouse(text, false, mouse_color.Color, "Calibri", mouse_size.value)
})
