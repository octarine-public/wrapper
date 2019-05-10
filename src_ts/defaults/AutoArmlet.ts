import * as Orders from "Orders"
import * as Utils from "Utils"

var config = {
		hotkey: 0,
		hp_threshold: 200,
	},
	next_check = 0,
	enabled = false,
	delay = 0.76

Events.on("onDraw", () => {
	if (enabled)
		Renderer.Text(0, 50, "Auto Armlet enabled")
})
Events.on("onTick", () => {
	let cur_time = GameRules.m_fGameTime
	if (!enabled || GameRules.m_bGamePaused || cur_time < next_check)
		return
	let pl_ent = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC
	if (pl_ent === undefined || !Utils.IsAlive(pl_ent))
		return
	let armlet = Utils.GetItemByName(pl_ent, "item_armlet") as C_DOTA_Item_Armlet
	if (armlet === undefined)
		return
	if (Utils.GetHealthAfter(pl_ent, delay, true) < config.hp_threshold) {
		if (armlet.m_bToggleState)
			Orders.ToggleAbil(pl_ent, armlet, false)
		Orders.ToggleAbil(pl_ent, armlet, true)
		next_check = cur_time + delay
	}
})
Events.on("onWndProc", (message_type, wParam) => {
	if (!IsInGame() || parseInt(wParam as any) !== config.hotkey)
		return true
	if (message_type === 0x100) // WM_KEYDOWN
		return false
	else if (message_type === 0x101) { // WM_KEYUP
		enabled = !enabled
		return false
	}
	return true
})
Events.on("onGameEnded", () => {
	enabled = false
	next_check = 0
})

{
	let root = new Menu_Node("Auto Armlet")
	root.entries.push(new Menu_Keybind (
		"Hotkey",
		config.hotkey,
		"Hotkey is in toggle mode",
		node => config.hotkey = node.value,
	))
	root.entries.push(new Menu_SliderInt (
		"HP Threshold",
		config.hp_threshold,
		10,
		300,
		node => config.hp_threshold = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
