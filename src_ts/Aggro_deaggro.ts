import { EventsSDK, GameState, Menu as MenuSDK, LocalPlayer, Unit, TickSleeper, Tower, EntityManager, Creep, Hero } from "wrapper/Imports"

const Sleep = new TickSleeper()
const Menu = MenuSDK.AddEntry(["Utility", "Aggro/deaggro Creeps"])
const AutoTowerState = Menu.AddToggle("Auto tower deaggro")
const aggroKey = Menu.AddKeybind("Aggro Key")
const deaggroKey = Menu.AddKeybind("Deaggro Key")

const GetDelayCast = () => (((GameState.Ping / 2) + 30) + 450)
const IsValidUnit = (x: Unit) => x.IsValid && x.IsAlive && x.IsVisible
const IsValidPlayerAttack = (x: Tower) => LocalPlayer!.Hero === x.TowerAttackTarget
const IsValidTower = (x: Tower) => x.TowerAttackTarget && x.IsAlive && x.Distance2D(x.TowerAttackTarget.Position) <= (x.AttackRange + x.HullRadius + 25)

function Use(x: Unit) {
	if (!IsValidUnit(x))
		return false
	LocalPlayer!.Hero?.AttackTarget(x)
	//LocalPlayer.Hero.MoveTo(Input.CursorOnWorld)
	Sleep.Sleep(GetDelayCast())
	return true
}

EventsSDK.on("Tick", () => {
	if (LocalPlayer!.IsSpectator || !LocalPlayer!.Hero?.IsAlive || Sleep.Sleeping)
		return
	if (AutoTowerState.value) {
		let Towers = EntityManager.GetEntitiesByClass(Tower)
		Towers.forEach(tower => {
			if (!tower.IsEnemy() || !IsValidTower(tower) || !IsValidPlayerAttack(tower))
				return
			if (EntityManager.GetEntitiesByClass(Creep).some(x =>
				!x.IsEnemy()
				&& x.IsAlive
				&& x.IsLaneCreep
				&& x.Distance2D(LocalPlayer!.Hero!.Position) < (x.AttackRange + x.HullRadius + 25)
				&& Use(x)))
				return
		})
	}
	if (aggroKey.is_pressed)
		if (EntityManager.GetEntitiesByClass(Hero).some(x => x.IsEnemy() && Use(x)))
			return
	if (deaggroKey.is_pressed)
		if (EntityManager.GetEntitiesByClass(Creep).some(x => !x.IsEnemy() && x.IsLaneCreep && Use(x)))
			return
})

EventsSDK.on("GameEnded", () => {
	Sleep.ResetTimer()
})
