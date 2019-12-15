import { Building, Unit, TickSleeper, EntityManager, Hero, Creep, Courier } from "wrapper/Imports"
import { DrawState, State, Swhicher } from "./Menu"
import { Renderer } from "./Renderer"
let Sleep: TickSleeper = new TickSleeper
function MoveUnit(x: Unit, to: Building) {
	x.MoveTo(to.Position)
	Sleep.Sleep(250)
}
function Switch(unit: Unit, building: Building) {
	if (!unit.IsVisible || !unit.IsAlive || !unit.IsControllable)
		return false
	switch (Swhicher.selected_id) {
		case 0:
			if (unit.IsHero) {
				MoveUnit(unit, building)
				return true
			}
			break
		case 1:
			MoveUnit(unit, building)
			break
	}
}

export function Tick() {
	if (!State.value || Sleep.Sleeping)
		return
	if (!EntityManager.GetEntitiesByClasses<Unit>([Hero, Creep, Courier], DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(x =>
		Switch(x, EntityManager.GetEntitiesByClass(Building, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
			.find(x => x.Name === "dota_fountain"))))
		return
}

export function Draw() {
	if (State.value && DrawState.value)
		Renderer()
}

export function GameEnded() {
	Sleep.ResetTimer()
}