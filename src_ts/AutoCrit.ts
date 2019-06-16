import * as Utils from "Utils"
import { EventsSDK, LocalPlayer, Unit, Entity } from "./CrutchesSDK/Imports"
var config = {
		hotkey: 0,
		method: 0,
	},
	enabled = false,
	target: Entity,
	target_pos

Events.on("onDraw", () => {
	if (enabled)
		Renderer.Text(0, 100, "Auto Crit enabled")
})

EventsSDK.on("onUnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) => {
	if (!enabled || !npc.IsControllableByPlayer(LocalPlayer.PlayerID))
		return
	if (activity === 1503) {
		if (target !== undefined)
			if (!target.IsEnemy(npc) || (target instanceof Unit && (target.IsWard || target.IsTower || target.IsShrine)))
				return
		npc.OrderStop(false)
		setTimeout(() => {
			if (target !== undefined)
				npc.AttackTarget(target, false)
			else if (target_pos !== undefined)
				npc.AttackMove(target_pos, false)
		}, config.method === 0 ? 1000 / npc.AttacksPerSecond / 3 : Math.max(100, 1000 / npc.AttacksPerSecond) - 100)
	}
})

EventsSDK.on("onPrepareUnitOrders", order => {
	if (order.Unit === LocalPlayer.Hero)
		switch (order.OrderType) {
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
				target = order.Target
				target_pos = undefined
				break
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
				target = undefined
				target_pos = order.Position
				break
			case dotaunitorder_t.DOTA_UNIT_ORDER_STOP:
				enabled = false
				break
			default:
				break
		}
	return true
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
Events.on("onGameEnded", () => enabled = false)

{
	let root = new Menu_Node("Auto Crit")
	root.entries.push(new Menu_Keybind (
		"Hotkey",
		config.hotkey,
		"Hotkey is in toggle mode",
		node => config.hotkey = node.value,
	))
	root.entries.push(new Menu_Combo (
		"Method",
		[
			"Faster",
			"Slower",
		],
		config.method,
		"Choose slower mode only if ",
		node => config.method = node.selected_id,
	))
	root.Update()
	Menu.AddEntry(root)
}
