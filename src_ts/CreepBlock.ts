import * as Orders from "Orders"
import * as Utils from "Utils"

var config: any = {
		hotkey: 78,
		block_sensitivity: 600,
	},
	last_time = Number.MIN_SAFE_INTEGER,
	lane_creeps: C_DOTA_BaseNPC_Creep[] = [],
	towers: C_DOTA_BaseNPC_Tower[] = [],
	enabled = false,
	creeps: C_DOTA_BaseNPC_Creep_Lane[] = [],
	creepsMovePosition: Vector

// Events.addListener("onDraw", () => {
// 	if (!IsInGame() || !enabled)
// 		return
// 	creeps.filter(creep => creep.m_bIsValid).map(creep => creep.m_vecNetworkOrigin).forEach(vec => {
// 		let screen_pos = Renderer.WorldToScreen(vec)
// 		if (!screen_pos.IsValid())
// 			return
// 		Renderer.FilledRect(screen_pos.x - 10, screen_pos.z - 10, 20, 20, 255, 0, 0)
// 	})
// 	creeps.filter(creep => creep.m_bIsValid).map(creep => creep.InFront(300)).forEach(vec => {
// 		let screen_pos = Renderer.WorldToScreen(vec)
// 		if (!screen_pos.IsValid())
// 			return
// 		Renderer.FilledRect(screen_pos.x - 10, screen_pos.z - 10, 20, 20, 0, 255, 0)
// 	})
// 	{
// 		let screen_pos = Renderer.WorldToScreen(creepsMovePosition)
// 		if (!screen_pos.IsValid())
// 			return
// 		Renderer.FilledRect(screen_pos.x - 10, screen_pos.z - 10, 20, 20, 0, 0, 255)
// 	}
// })

Events.addListener("onPrepareUnitOrders", order => order.unit !== LocalDOTAPlayer.m_hAssignedHero || !enabled || Utils.GetOrdersWithoutSideEffects().includes(order.order_type))
Events.addListener("onTick", () => {
	if (!enabled)
		return
	last_time = GameRules.m_fGameTime
	var MyEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC
	if (MyEnt === undefined || !MyEnt.m_bIsAlive || IsPaused())
		return
	creeps = lane_creeps.filter(creep => creep.m_bIsValid && !creep.m_bIsWaitingToSpawn && creep.m_bIsAlive && MyEnt.IsInRange(creep, 500))
	if (creeps.length === 0)
		return
	var creepsMovePositionSum = creeps.map(creep => creep.InFront(300)).reduce((sum, vec) => [sum[0] + vec.x, sum[1] + vec.y, sum[2] + vec.z], [0, 0, 0])
	creepsMovePosition = new Vector(creepsMovePositionSum[0] / creeps.length, creepsMovePositionSum[1] / creeps.length, creepsMovePositionSum[2] / creeps.length)
	var tower = towers.filter(ent => MyEnt.IsInRange(ent, 120))

	if (tower.length > 0) {
		Orders.MoveToPos(MyEnt, creepsMovePosition, false)
		return
	}
	var flag = true
	Utils.orderBy(creeps, creep => creep.DistTo2D(MyEnt)).every(creep => {
		if (!creep.m_bIsMoving && !creep.IsInRange(MyEnt, 50))
			return true
		var creepDistance = creepsMovePosition.DistTo2D(creep.m_vecNetworkOrigin) + 50,
			heroDistance = creepsMovePosition.DistTo2D(MyEnt.m_vecNetworkOrigin),
			creepAngle = creep.FindRotationAngle(MyEnt.m_vecNetworkOrigin)
		if (creepDistance < heroDistance && creepAngle > 2 || creepAngle > 2.5)
			return true
		var moveDistance = config.block_sensitivity / MyEnt.m_fIdealSpeed * 100
		if (MyEnt.m_fIdealSpeed - creep.m_fIdealSpeed > 50)
			moveDistance -= (MyEnt.m_fIdealSpeed - creep.m_fIdealSpeed) / 2
		var movePosition = creep.InFront(Math.max(moveDistance, moveDistance * creepAngle))
		if (movePosition.DistTo2D(creepsMovePosition) - 50 > heroDistance)
			return true
		if (creepAngle < 0.2 && MyEnt.m_bIsMoving)
			return true

		Orders.MoveToPos(MyEnt, movePosition, false)
		flag = false
		return false
	})
	if (!flag)
		return
	if (MyEnt.m_bIsMoving)
		Orders.EntStop(MyEnt, false)
	else if (MyEnt.FindRotationAngle(creepsMovePosition) > 1.5)
		Orders.MoveToPos(MyEnt, MyEnt.m_vecNetworkOrigin.ExtendVector(creepsMovePosition, 10), false)
})
Events.addListener("onNPCCreated", (npc: C_DOTA_BaseNPC) => {
	if (npc.m_bIsLaneCreep && !npc.IsEnemy(LocalDOTAPlayer))
		lane_creeps.push(npc as C_DOTA_BaseNPC_Creep)
	if (npc.m_bIsTower && npc.m_iszUnitName === "npc_dota_badguys_tower2_mid")
		towers.push(npc as C_DOTA_BaseNPC_Tower)
})
Events.addListener("onEntityDestroyed", ent => {
	if (ent instanceof C_DOTA_BaseNPC_Creep)
		Utils.arrayRemove(lane_creeps, ent)
	else if (ent instanceof C_DOTA_BaseNPC_Tower)
		Utils.arrayRemove(towers, ent)
})
Events.addListener("onWndProc", (message_type, wParam) => {
	if (!IsInGame() || parseInt(wParam as any) !== config.hotkey)
		return true
	if (message_type === 0x100) { // WM_KEYDOWN
		enabled = true
		return false
	} else if (message_type === 0x101) { // WM_KEYUP
		enabled = false
		return false
	}
	return true
})
Events.addListener("onGameEnded", () => {
	last_time = Number.MIN_SAFE_INTEGER
	lane_creeps = []
	towers = []
	enabled = false
})

{
	let root = new Menu_Node("CreepBlock")
	root.entries.push(new Menu_Keybind (
		"Hotkey",
		config.hotkey,
		"Hotkey is in hold mode",
		node => config.hotkey = node.value,
	))
	root.entries.push(new Menu_SliderFloat (
		"Block sensitivity",
		config.block_sensitivity,
		500,
		700,
		"Bigger value will result in smaller block, but with higher success rate",
		node => config.block_sensitivity = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
