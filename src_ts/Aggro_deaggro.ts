import { EventsSDK, Game, Menu as MenuSDK, LocalPlayer, Unit, TickSleeper, ArrayExtensions, Utils, Tower } from "wrapper/Imports";

const Menu = MenuSDK.AddEntry(["Utility", "Aggro/deaggro Creeps"])
//const AutoTowerTree = Menu.AddNode("Tower deaggro")
const AutoTowerState = Menu.AddToggle("Auto tower deaggro", true)
//const MePositionCheck = AutoTowerTree.AddToggle("Check my position")

const aggroKey = Menu.AddKeybind("Aggro Key")
const deaggroKey = Menu.AddKeybind("Deaggro Key")

let Units: Unit[] = []
let Towers: Tower[] = []
let GetDelayCast = () => (((Game.Ping / 2) + 30) + 250)

const Sleep = new TickSleeper
const IsValidUnit = (x: Unit) => x.IsValid && x.IsAlive && x.IsVisible
const IsValidPlayerAttack = (x: Tower) => LocalPlayer !== undefined && x.TowerAttackTarget === LocalPlayer.Hero
const IsValidPlayer = () => LocalPlayer !== undefined && LocalPlayer.Hero !== undefined && !LocalPlayer.IsSpectator && LocalPlayer.Hero.IsAlive
const IsValidTower = (x: Tower) => x.TowerAttackTarget !== undefined && x.IsAlive && x.Distance2D(x.TowerAttackTarget.Position) <= (x.AttackRange + x.HullRadius + 25)
//const DistanceToTowerMe = (tower: Tower, creep: Unit) => creep.Distance2D(tower) <= (IsValidPlayer() && LocalPlayer.Hero.Distance2D(tower))

function Use(x: Unit) {
	if (!IsValidUnit(x))
		return false
	LocalPlayer.Hero.AttackTarget(x)
	LocalPlayer.Hero.MoveTo(Utils.CursorWorldVec)
	Sleep.Sleep(GetDelayCast())
	return true
}

EventsSDK.on("Tick", () => {
	if (!Game.IsInGame || !IsValidPlayer() || Sleep.Sleeping)
		return
	if (AutoTowerState.value) {
		Towers.forEach(tower => {
			if (!IsValidTower(tower) || !IsValidPlayerAttack(tower))
				return
			if (Units.some(x => !x.IsEnemy()
				&& x.IsLaneCreep
				&& x.Distance2D(IsValidPlayer() && LocalPlayer.Hero.Position) < (x.AttackRange + x.HullRadius + 25)
				//&& DistanceToTowerMe(tower, x)
				&& Use(x)))
				return
		})
	}
	if (aggroKey.is_pressed) {
		if (Units.some(x => x.IsEnemy() && x.IsHero && Use(x)))
			return
	}
	if (deaggroKey.is_pressed) {
		if (Units.some(x => !x.IsEnemy() && x.IsLaneCreep && Use(x)))
			return
	}
})

EventsSDK.on("EntityCreated", x => {
	if (x instanceof Unit)
		Units.push(x)
	if (x instanceof Tower)
		Towers.push(x)
})

EventsSDK.on("EntityDestroyed", x => {
	if (x instanceof Unit)
		ArrayExtensions.arrayRemove(Units, x)
	if (x instanceof Tower)
		ArrayExtensions.arrayRemove(Towers, x)
})

EventsSDK.on("GameEnded", () => {
	Units = []
	Towers = []
	Sleep.ResetTimer()
})