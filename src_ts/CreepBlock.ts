import * as Orders from "Orders"
import * as Utils from "Utils"

var config: any = {
		hotkey: 78,
		block_sensitivity: 600,
		skipRange: false
	},
	last_time = 0,
	lane_creeps: C_DOTA_BaseNPC_Creep[] = [],
	towers: C_DOTA_BaseNPC_Tower[] = [],
	enabled = false,
	creeps: C_DOTA_BaseNPC_Creep_Lane[] = [],
	creepsMovePosition: Vector3

// Events.on("onDraw", () => {
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

//Events.on("onPrepareUnitOrders", order => order.unit !== LocalDOTAPlayer.m_hAssignedHero || !enabled || Utils.GetOrdersWithoutSideEffects().includes(order.order_type))
Events.on("onTick", () => {
	if (!enabled)
		return
		
	if (Date.now() < last_time)
		return;
		
	last_time = Date.now() + 50;
	
	var MyEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC
	if (MyEnt === undefined || !Utils.IsAlive(MyEnt) || GameRules.m_bGamePaused)
		return
	creeps = lane_creeps.filter(creep => {
		if (config.skipRange && Utils.HasAttackCapability(creep, DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK))
			return false;
			
		return !creep.m_bIsWaitingToSpawn && Utils.IsAlive(creep) && Utils.IsInRange(MyEnt, creep, 500)
	});
	
	if (creeps.length === 0)
		return
		
	creepsMovePosition = creeps
		.reduce((sum, vec) => sum.Add(Utils.InFront(vec, 300)), new Vector3())
		.DivideScalar(creeps.length)
		
	var tower = towers.filter(ent => Utils.IsInRange(MyEnt, ent, 120))

	if (tower.length > 0) {
		Orders.MoveToPos(MyEnt, creepsMovePosition, false)
		return
	}
	
	creeps = Utils.orderBy(creeps, creep => creepsMovePosition.Distance2D(creep.m_vecNetworkOrigin));
	
	let stopping = creeps.some(creep => {
		if (!creep.m_bIsMoving && !Utils.IsInRange(creep, MyEnt, 50))
			return false
		var creepDistance = creepsMovePosition.Distance2D(creep.m_vecNetworkOrigin) + 50,
			heroDistance = creepsMovePosition.Distance2D(MyEnt.m_vecNetworkOrigin),
			creepAngle = MyEnt.m_vecNetworkOrigin.FindRotationAngle(creep)
		if (creepDistance < heroDistance && creepAngle > 2 || creepAngle > 2.5)
			return false
		var moveDistance = config.block_sensitivity / MyEnt.m_fIdealSpeed * 100
		if (MyEnt.m_fIdealSpeed - creep.m_fIdealSpeed > 50)
			moveDistance -= (MyEnt.m_fIdealSpeed - creep.m_fIdealSpeed) / 2
		var movePosition = Utils.InFront(creep, Math.max(moveDistance, moveDistance * creepAngle))
		if (movePosition.Distance2D(creepsMovePosition) - 50 > heroDistance)
			return false
		if (creepAngle < 0.2 && MyEnt.m_bIsMoving)
			return false

		Orders.MoveToPos(MyEnt, movePosition, false)
		return true
	})
	if (stopping)
		return
	if (MyEnt.m_bIsMoving)
		Orders.EntStop(MyEnt, false)
	else if (creepsMovePosition.FindRotationAngle(MyEnt) > 1.5)
		Orders.MoveToPos(MyEnt, MyEnt.m_vecNetworkOrigin.Extend(creepsMovePosition, 10), false)
})
Events.on("onNPCCreated", (npc: C_DOTA_BaseNPC) => {
	if (Utils.IsLaneCreep(npc) && !Utils.IsEnemy(npc, LocalDOTAPlayer))
		lane_creeps.push(npc as C_DOTA_BaseNPC_Creep)
	if (Utils.IsTower(npc) && npc.m_iszUnitName === "npc_dota_badguys_tower2_mid")
		towers.push(npc as C_DOTA_BaseNPC_Tower)
})
Events.on("onEntityDestroyed", ent => {
	if (ent instanceof C_DOTA_BaseNPC_Creep)
		Utils.arrayRemove(lane_creeps, ent)
	else if (ent instanceof C_DOTA_BaseNPC_Tower)
		Utils.arrayRemove(towers, ent)
})
Events.on("onWndProc", (message_type, wParam) => {
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
Events.on("onGameEnded", () => {
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
	root.entries.push(new Menu_Toggle(
		"Skip Range",
		config.skipRange,
		node => config.skipRange = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
