import { EventsSDK, Game, Menu as MenuSDK, LocalPlayer, Unit, TickSleeper, ArrayExtensions, Utils } from "wrapper/Imports";

const Menu = MenuSDK.AddEntry(["Utility", "Aggro/deaggro"])
const aggroKey = Menu.AddKeybind("Aggro Key")
const deaggroKey = Menu.AddKeybind("Deaggro Key")

let Units: Unit[] = []
let Sleep = new TickSleeper
let IsValidUnit = (x: Unit) => x.IsValid && x.IsVisible
let IsValidPlayer = () => LocalPlayer !== undefined && LocalPlayer.Hero !== undefined && !LocalPlayer.IsSpectator

function Use(x: Unit) {
	if (!IsValidUnit(x))
		return false
	LocalPlayer.Hero.AttackTarget(x)
	LocalPlayer.Hero.MoveToDirection(Utils.CursorWorldVec)
	Sleep.Sleep(350)
	return true
}

EventsSDK.on("Tick", () => {
	if (!Game.IsInGame || !IsValidPlayer() || Sleep.Sleeping)
		return
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
})

EventsSDK.on("EntityDestroyed", x => {
	if (x instanceof Unit)
		ArrayExtensions.arrayRemove(Units, x)
})

EventsSDK.on("GameEnded", () => {
	Units = []
	Sleep.ResetTimer()
})