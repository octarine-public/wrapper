import { Building, Unit, TickSleeper, EntityManager, Hero, Creep, Courier } from "wrapper/Imports"
import { DrawState, State, Swhicher } from "./Menu"
import { Renderer } from "./Renderer"
import { B_Utils } from "../Base/Utils"
let Sleep: TickSleeper = new TickSleeper
export let Units: Unit[] = []
function MoveUnit(x: Unit, to: Building) {
	x.MoveTo(to.Position)
	Sleep.Sleep(B_Utils.GetDelayCast)
	return true
}
function Switch(unit: Unit, building: Building) {
	if (!unit.IsVisible || !unit.IsAlive || !unit.IsControllable)
		return false
	switch (Swhicher.selected_id) {
		case 0:
			return unit.IsHero && MoveUnit(unit, building)
		case 1:
			return MoveUnit(unit, building)
	}
}

export function Tick() {
	if (!State.value || Sleep.Sleeping)
		return
	Units = EntityManager.GetEntitiesByClasses<Unit>([Hero, Creep, Courier])
	if (!Units.some(x => !x.IsEnemy() && Switch(x, EntityManager.GetEntitiesByClass(Building)
		.find(x => x.IsEnemy() && x.Name === "dota_fountain"))))
		return
}

export function Draw() {
	if (State.value && DrawState.value)
		Renderer()
}

export function GameEnded() {
	Sleep.ResetTimer()
}