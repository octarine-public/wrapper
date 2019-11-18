import { EntityManager, EventsSDK, Game, Input, InputEventSDK, Menu as MenuSDK, MouseWheel, RendererSDK, Vector3, VKeys } from "./wrapper/Imports"
import UserCmd from "./wrapper/Native/UserCmd"

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

let PrepareUnitOrders_old = PrepareUnitOrders
let last_order_click = new Vector3(),
	last_order_click_update = 0
global.PrepareUnitOrders = (order: { // pass Position: Vector3 at IOBuffer offset 0
	OrderType: dotaunitorder_t,
	Target?: C_BaseEntity | number,
	Ability?: C_BaseEntity | number,
	OrderIssuer?: PlayerOrderIssuer_t,
	Unit?: (C_BaseEntity | number)[] | C_BaseEntity | number,
	Queue?: boolean,
	ShowEffects?: boolean,
}) => {
	switch (order.OrderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PATROL:
		case dotaunitorder_t.DOTA_UNIT_ORDER_RADAR:
		case dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION:
			last_order_click.CopyFrom(Vector3.fromIOBuffer())
			last_order_click_update = Date.now()
			break
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
		// case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE:
			last_order_click.CopyFrom(order.Target instanceof C_BaseEntity ? EntityManager.GetEntityByNative(order.Target).Position : Vector3.fromIOBuffer())
			last_order_click_update = Date.now()
			break
		default:
			break
	}
	PrepareUnitOrders_old(order)
}

let latest_camera_x = 0,
	latest_camera_y = 0
// let last_camera_vec = new Vector3(),
// 	last_mouse_vec = new Vector3(),
// 	last_mouse_pos = new Vector2()
EventsSDK.after("Update", (cmd: UserCmd) => {
	let CursorWorldVec = cmd.VectorUnderCursor,
		// orig_CursorWorldVec = cmd.VectorUnderCursor.Clone(),
		// orig_camera_vec = new Vector3(cmd.CameraX, cmd.CameraY),
		mult = Math.sin(Date.now() - last_order_click_update)
	if (last_order_click_update + 450 >= Date.now()) {
		CursorWorldVec = last_order_click.Extend(CursorWorldVec, Math.min(last_order_click.Distance(CursorWorldVec), 200 * mult)).CopyTo(last_order_click)
		cmd.CameraX = latest_camera_x
		cmd.CameraY = latest_camera_y
	}
	cmd.VectorUnderCursor = CursorWorldVec.SetZ(RendererSDK.GetPositionHeight(CursorWorldVec.toVector2()))
	let camera_vec = new Vector3(cmd.CameraX, cmd.CameraY)
	camera_vec = camera_vec.Clone().AddScalarY(1134 / 2).Distance2D(CursorWorldVec) > 1300
		? CursorWorldVec.Clone().SubtractScalarY(1134 / 2)
		: camera_vec = camera_vec.AddScalarY(1134 / 2).Extend(CursorWorldVec, Math.min(camera_vec.Distance(CursorWorldVec), 150 * (last_order_click_update + 450 >= Date.now() ? mult : 1))).SubtractScalarY(1134 / 2)
	latest_camera_x = cmd.CameraX = camera_vec.x
	latest_camera_y = cmd.CameraY = camera_vec.y

	let cur_pos = RendererSDK.WorldToScreenCustom(CursorWorldVec, camera_vec.toVector2())
	if (cur_pos !== undefined) {
		cmd.MouseX = cur_pos.x
		cmd.MouseY = cur_pos.y
	} else
		cmd.MouseX = cmd.MouseY = 0.5

	// last_mouse_vec.CopyFrom(cmd.VectorUnderCursor)
	// last_mouse_pos.SetX(cmd.MouseX).SetY(cmd.MouseY).MultiplyForThis(RendererSDK.WindowSize)
	// last_camera_vec.SetX(cmd.CameraX).SetY(cmd.CameraY)
	// last_camera_vec.SetZ(RendererSDK.GetPositionHeight(last_camera_vec.toVector2()))
})

// EventsSDK.on("Draw", () => {
// 	RendererSDK.FilledRect(last_mouse_pos.SubtractScalar(5), new Vector2(10, 10), Color.Red)

// 	let camera_screen_pos = RendererSDK.WorldToScreen(last_camera_vec)
// 	if (camera_screen_pos !== undefined)
// 		RendererSDK.FilledRect(camera_screen_pos.SubtractScalar(5), new Vector2(10, 10), Color.Green)

// 	let mouse_screen_pos = RendererSDK.WorldToScreen(last_mouse_vec)
// 	if (mouse_screen_pos !== undefined)
// 		RendererSDK.FilledRect(mouse_screen_pos.SubtractScalar(5), new Vector2(10, 10), Color.Blue)

// 	mouse_screen_pos = RendererSDK.WorldToScreen(RendererSDK.ScreenToWorld(new Vector2(0, 0)))
// 	if (mouse_screen_pos !== undefined)
// 		RendererSDK.FilledRect(mouse_screen_pos.SubtractScalar(5), new Vector2(10, 10), Color.Yellow)
// 	mouse_screen_pos = RendererSDK.WorldToScreen(RendererSDK.ScreenToWorld(new Vector2(RendererSDK.WindowSize.x)))
// 	if (mouse_screen_pos !== undefined)
// 		RendererSDK.FilledRect(mouse_screen_pos.SubtractScalar(5), new Vector2(10, 10), Color.Yellow)
// 	mouse_screen_pos = RendererSDK.WorldToScreen(RendererSDK.ScreenToWorld(new Vector2(0, RendererSDK.WindowSize.y)))
// 	if (mouse_screen_pos !== undefined)
// 		RendererSDK.FilledRect(mouse_screen_pos.SubtractScalar(5), new Vector2(10, 10), Color.Yellow)
// 	mouse_screen_pos = RendererSDK.WorldToScreen(RendererSDK.ScreenToWorld(RendererSDK.WindowSize))
// 	if (mouse_screen_pos !== undefined)
// 		RendererSDK.FilledRect(mouse_screen_pos.SubtractScalar(5), new Vector2(10, 10), Color.Yellow)
// })
