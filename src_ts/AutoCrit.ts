import { Entity, EntityManager, EventsSDK, Game, LocalPlayer, Unit } from "./wrapper/Imports"

var config = { hotkey: 0},
	enabled = false,
	target: Entity,
	target_pos,
	timer: number = 0
Events.on("Draw", () => {
	if (enabled)
		Renderer.Text(0, 100, "Auto Crit enabled")
})
EventsSDK.on("UnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) => {
	if (!enabled || !npc.IsControllableByPlayer(LocalPlayer.PlayerID))
		return
	if (activity == 1505) {
		timer = Game.GameTime + castpoint
	} else if (activity === 1503) {
		if (target !== undefined)
			if (!target.IsEnemy(npc) || (target instanceof Unit && (target.IsWard || target.IsTower || target.IsShrine)))
				return
		npc.OrderStop(false)
	}
})
EventsSDK.on("PrepareUnitOrders", order => {
	if (order.Unit === LocalPlayer.Hero)
		switch (order.OrderType) {
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
				target = order.Target instanceof Entity ? order.Target : EntityManager.EntityByIndex(order.Target)
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
Events.on("Update", () => {
	if (!enabled || target === undefined || !target.IsAlive || LocalPlayer.Hero === undefined)
		return false
	let Me = LocalPlayer.Hero
	if (timer <= Game.GameTime) {
		let AttacksPerSecond = Me.AttacksPerSecond
		switch (Me.Name) {
			case "npc_dota_hero_phantom_assassin":
				if (AttacksPerSecond < 0.29)
					timer = Game.GameTime + 0.14
				else if (AttacksPerSecond < 0.35)
					timer = Game.GameTime + 0.15
				else if (AttacksPerSecond < 0.54)
					timer = Game.GameTime + 0.17
				else if (AttacksPerSecond < 0.71)
					timer = Game.GameTime + 0.20
				else if (AttacksPerSecond < 0.86)
					timer = Game.GameTime + 0.24
				else if (AttacksPerSecond < 1.08)
					timer = Game.GameTime + 0.27
				else if (AttacksPerSecond < 1.24)
					timer = Game.GameTime + 0.3
				Me.AttackTarget(target, false)
				break
			case "npc_dota_hero_skeleton_king":
				if (AttacksPerSecond < 0.29)
					timer = Game.GameTime + 0.175
				else if (AttacksPerSecond < 0.34)
					timer = Game.GameTime + 0.2
				else if (AttacksPerSecond < 0.54)
					timer = Game.GameTime + 0.27
				else if (AttacksPerSecond < 0.67)
					timer = Game.GameTime + 0.3
				else if (AttacksPerSecond < 0.79)
					timer = Game.GameTime + 0.32
				else if (AttacksPerSecond < 0.87)
					timer = Game.GameTime + 0.37
				else if (AttacksPerSecond < 0.96)
					timer = Game.GameTime + 0.4
				else if (AttacksPerSecond < 1.10)
					timer = Game.GameTime + 0.44
				else if (AttacksPerSecond < 1.20)
					timer = Game.GameTime + 0.47
				else if (AttacksPerSecond < 1.45)
					timer = Game.GameTime + 0.57
				Me.AttackTarget(target, false)
				break
			case "npc_dota_hero_juggernaut":
				if (AttacksPerSecond < 0.27)
					timer = Game.GameTime + 0.14
				else if (AttacksPerSecond < 0.39)
					timer = Game.GameTime + 0.17
				else if (AttacksPerSecond < 0.48)
					timer = Game.GameTime + 0.20
				else if (AttacksPerSecond < 0.69)
					timer = Game.GameTime + 0.24
				else if (AttacksPerSecond < 0.85)
					timer = Game.GameTime + 0.27
				else if (AttacksPerSecond < 0.97)
					timer = Game.GameTime + 0.30
				else if (AttacksPerSecond < 1.12)
					timer = Game.GameTime + 0.34
				Me.AttackTarget(target, false)
				break
			case "npc_dota_hero_chaos_knight":
				if (AttacksPerSecond < 0.33)
					timer = Game.GameTime + 0.17
				else if (AttacksPerSecond < 0.38)
					timer = Game.GameTime + 0.2
				else if (AttacksPerSecond < 0.54)
					timer = Game.GameTime + 0.27
				else if (AttacksPerSecond < 0.42)
					timer = Game.GameTime + 0.21
				else if (AttacksPerSecond < 0.48)
					timer = Game.GameTime + 0.24
				else if (AttacksPerSecond < 0.67)
					timer = Game.GameTime + 0.27
				else if (AttacksPerSecond < 0.79)
					timer = Game.GameTime + 0.31
				else if (AttacksPerSecond < 0.87)
					timer = Game.GameTime + 0.35
				else if (AttacksPerSecond < 0.96)
					timer = Game.GameTime + 0.37
				else if (AttacksPerSecond < 1.10)
					timer = Game.GameTime + 0.41
				else if (AttacksPerSecond < 1.28)
					timer = Game.GameTime + 0.44
				else if (AttacksPerSecond < 1.5)
					timer = Game.GameTime + 0.54
				Me.AttackTarget(target, false)
				break
			default: return
		}
	}
})
Events.on("WndProc", (message_type, wParam) => {
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
Events.on("GameEnded", () => enabled = false)

{
	let root = new Menu_Node("Auto Crit")
	root.entries.push(new Menu_Keybind(
		"Hotkey",
		config.hotkey,
		"Hotkey is in toggle mode",
		node => config.hotkey = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
