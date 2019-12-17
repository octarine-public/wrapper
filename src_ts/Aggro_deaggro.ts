import { EventsSDK, Game, Menu as MenuSDK, LocalPlayer, Unit, TickSleeper, Tower, EntityManager, Creep, Hero } from "wrapper/Imports"

const Menu = MenuSDK.AddEntry(["Utility", "Aggro/deaggro Creeps"])
//const AutoTowerTree = Menu.AddNode("Tower deaggro")
const AutoTowerState = Menu.AddToggle("Auto tower deaggro")
//const MePositionCheck = AutoTowerTree.AddToggle("Check my position")
const Sleep = new TickSleeper
const aggroKey = Menu.AddKeybind("Aggro Key")
const deaggroKey = Menu.AddKeybind("Deaggro Key")

let Owner: Hero
const GetDelayCast = () => (((Game.Ping / 2) + 30) + 450)
const IsValidUnit = (x: Unit) => x.IsValid && x.IsAlive && x.IsVisible
const IsValidPlayerAttack = (x: Tower) => Owner !== undefined && Owner === x.TowerAttackTarget
const IsValidPlayer = () => !LocalPlayer.IsSpectator && Owner?.IsAlive
const IsValidTower = (x: Tower) => x.TowerAttackTarget && x.IsAlive && x.Distance2D(x.TowerAttackTarget.Position) <= (x.AttackRange + x.HullRadius + 25)
//const DistanceToTowerMe = (tower: Tower, creep: Unit) => creep.Distance2D(tower) <= (IsValidPlayer() && LocalPlayer.Hero.Distance2D(tower))

function Use(x: Unit) {
	if (!IsValidUnit(x))
		return false
	Owner.AttackTarget(x)
	//LocalPlayer.Hero.MoveTo(Utils.CursorWorldVec)
	Sleep.Sleep(GetDelayCast())
	return true
}

EventsSDK.on("Tick", () => {
	if (!Game.IsInGame || !IsValidPlayer() || Sleep.Sleeping)
		return
	if (AutoTowerState.value) {
		let Towers = EntityManager.GetEntitiesByClass(Tower, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
		Towers.forEach(tower => {
			if (!IsValidTower(tower) || !IsValidPlayerAttack(tower))
				return
			if (EntityManager.GetEntitiesByClass(Creep, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(x => x.IsAlive
				&& x.IsLaneCreep
				&& x.Distance2D(Owner?.Position) < (x.AttackRange + x.HullRadius + 25)
				//&& DistanceToTowerMe(tower, x)
				&& Use(x)))
				return
		})
	}
	if (aggroKey.is_pressed)
		if (EntityManager.GetEntitiesByClass(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).some(Use))
			return
	if (deaggroKey.is_pressed)
		if (EntityManager.GetEntitiesByClass(Creep, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(x => x.IsLaneCreep && Use(x)))
			return
})

EventsSDK.on("GameStarted", (hero) => {
	if (Owner === undefined)
		Owner = hero
})
EventsSDK.on("GameEnded", () => {
	Sleep.ResetTimer()
})