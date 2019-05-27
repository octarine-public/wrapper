import { MenuManager, Game, EventsSDK, LocalPlayer, Unit, Creep, Tower, Vector3, Utils, Entity } from "./CrutchesSDK/Imports";
//import * as Orders from "Orders"
//import * as Utils from "Utils"

const Menu = MenuManager.MenuFactory("CreepBlock");
const stateMenu = Menu.AddToggle("State");
const hotkeyState = Menu.AddKeybind("Hotkey", "N", "Hotkey is in hold mode");
const sensitivityBlockState = Menu.AddSliderFloat("Block sensitivity", 600, 500, 700, "Bigger value will result in smaller block, but with higher success rate");
const skipRange = Menu.AddToggle("Skip Range");

var last_time = 0,
	lane_creeps: Creep[] = [],
	towers: Tower[] = []

// EventsSDK.on("onDraw", () => {
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

//EventsSDK.on("onPrepareUnitOrders", order => order.unit !== LocalDOTAPlayer.m_hAssignedHero || !enabled || Utils.GetOrdersWithoutSideEffects().includes(order.order_type))
EventsSDK.on("onTick", () => {
	if (!stateMenu.value || !hotkeyState.IsPressed)
		return
		
	if (Date.now() < last_time)
		return;
		
	last_time = Date.now() + 30;
	
	var MyEnt = LocalPlayer.Hero;
	if (MyEnt === undefined || !MyEnt.IsAlive || Game.IsPaused)
		return
		
	let creeps = lane_creeps.filter(creep => {
		if (skipRange.value && creep.IsRangeAttacker)
			return false;
			
		return !creep.IsWaitingToSpawn && creep.IsAlive && MyEnt.IsInRange(creep, 500)
	});
	
	if (creeps.length === 0)
		return
		
	let creepsMovePosition = creeps
		.reduce((sum, vec) => sum.Add(vec.InFront(500)), new Vector3())
		.DivideScalar(creeps.length)
		
	let tower = towers.filter(ent => ent.IsAlive && MyEnt.IsInRange(ent, 120))

	if (tower.length > 0) {
		MyEnt.MoveTo(creepsMovePosition);
		return
	}
	
	creeps = Utils.orderBy(creeps, creep => creep.Distance2D(creepsMovePosition));
	
	let stopping = creeps.some(creep => {
		if (!creep.IsMoving && !creep.IsInRange(MyEnt, 50))
			return false
			
		var creepDistance = creep.Distance2D(creepsMovePosition) + 50,
			heroDistance = MyEnt.Distance2D(creepsMovePosition),
			creepAngle = creep.FindRotationAngle(MyEnt.NetworkPosition)
			
		if (creepDistance < heroDistance && creepAngle > 2 || creepAngle > 2.5)
			return false
			
		var moveDistance = sensitivityBlockState.value / MyEnt.IdealSpeed * 100
		
		if (MyEnt.IdealSpeed - creep.IdealSpeed > 50)
			moveDistance -= (MyEnt.IdealSpeed - creep.IdealSpeed) / 2
			
		var movePosition = creep.InFront(Math.max(moveDistance, moveDistance * creepAngle))
		
		if (movePosition.Distance2D(creepsMovePosition) - 50 > heroDistance)
			return false
			
		if (creepAngle < 0.2 && MyEnt.IsMoving)
			return false

		MyEnt.MoveTo(movePosition)
		return true
	})
	if (stopping)
		return
	if (MyEnt.IsMoving)
		MyEnt.UnitStop()
	else if (MyEnt.FindRotationAngle(creepsMovePosition) > 1.5)
		MyEnt.MoveTo(MyEnt.Position.Extend(creepsMovePosition, 10))
})
EventsSDK.on("onEntityCreated", npc => {
	if (npc instanceof Creep && npc.IsLaneCreep && !npc.IsEnemy())
		lane_creeps.push(npc)
	if (npc instanceof Tower && npc.Name === "npc_dota_badguys_tower2_mid")
		towers.push(npc)
})
EventsSDK.on("onEntityDestroyed", ent => {
	if (ent instanceof Creep)
		Utils.arrayRemove(lane_creeps, ent)
	else if (ent instanceof Tower)
		Utils.arrayRemove(towers, ent)
})
//EventsSDK.on("onWndProc", (message_type, wParam) => !Game.IsInGame || parseInt(wParam as any) !== hotkeyState.value)
EventsSDK.on("onGameEnded", () => {
	lane_creeps = []
	towers = []
	last_time = 0;
})