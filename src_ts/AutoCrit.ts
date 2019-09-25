import { Entity, EntityManager, EventsSDK, Game, LocalPlayer, Menu, RendererSDK, Unit, Vector2, Vector3 } from "./wrapper/Imports"

const Menu_ = Menu.AddEntry(["Utility", "Auto Crit"]),
	MenuState = Menu_.AddToggle("State"),
	hotkey = Menu_.AddKeybind("Hotkey").OnRelease(() => MenuState.value = !MenuState.value)

var target: Entity,
	target_pos: Vector3,
	timer: number = 0

Events.on("Draw", () => {
	if (MenuState.value && Game.UIState === DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		RendererSDK.Text("Auto Crit enabled", new Vector2(0, 100))
})
EventsSDK.on("UnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) => {
	if (!MenuState.value || !npc.IsControllable)
		return
	if (activity === 1503) {
		if (target !== undefined)
			if (!target.IsEnemy(npc) || (target instanceof Unit && (target.IsWard || target.IsTower || target.IsShrine)))
				return
		npc.OrderStop(false)
	} else if (activity === 1505)
		timer = Game.GameTime + castpoint
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
				MenuState.value = false
				break
			default:
				break
		}
	return true
})
Events.on("Update", () => {
	if (!MenuState.value || !hotkey.is_pressed || target === undefined || !target.IsAlive || LocalPlayer.Hero === undefined)
		return false
	let Me = LocalPlayer.Hero
	if (Me.Name !== "npc_dota_hero_phantom_assassin"
		&& Me.Name !== "npc_dota_hero_skeleton_king" && Me.Name !== "npc_dota_hero_juggernaut"
		&& Me.Name !== "npc_dota_hero_chaos_knight")
		return false

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
			default:
			return false
		}
	}
})