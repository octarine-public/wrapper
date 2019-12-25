import { Building, Unit, TickSleeper, EntityManager, Hero, Creep, Courier, Entity, ArrayExtensions } from "wrapper/Imports"
import { DrawState, State, SwitchUnit } from "./Menu"
import { Renderer } from "./Renderer"
import { B_Utils } from "../Base/Utils"
let Sleep: TickSleeper = new TickSleeper
let Fountains: Building[] = []
export let Units: Unit[] = []

function MoveUnit(unit: Unit, to: Building) {
	let alliesFontain = Fountains.find(x => !x.IsEnemy()),
		tp = unit.Inventory.TotalItems.find(item => item?.Name === "item_tpscroll")

	if (tp === undefined
		&& unit.HasBuffByName("modifier_fountain_aura_buff")
		&& unit.IsInRange(alliesFontain.Position, 1000)
	) {
		// unit.PurchaseItem(46)
		// Sleep.Sleep(B_Utils.GetDelayCast)
	} else if (tp?.CanBeCasted()) {
		unit.CastPosition(tp, to.Position)
		Sleep.Sleep(B_Utils.GetDelayCast)
	}

	if (unit.IsMoving)
		return false
	unit.MoveTo(to.Position)
	Sleep.Sleep(B_Utils.GetDelayCast)
	return true
}

function Switch(unit: Unit, building: Building) {
	if (!unit.IsVisible)
		return false
	switch (SwitchUnit.selected_id) {
		case 0: return unit.IsHero && MoveUnit(unit, building)
		case 1: return MoveUnit(unit, building)
	}
}

export function Tick() {
	if (!State.value || Sleep.Sleeping)
		return
	Units = EntityManager.GetEntitiesByClasses<Unit>([Hero, Creep, Courier])
	if (Units.some(x => x.IsAlive
		&& !x.IsEnemy()
		&& !x.IsChanneling
		&& x.IsControllable
		&& Switch(x, Fountains.find(x => x.IsEnemy() && x.Name === "dota_fountain"))))
		return
}

export function Draw() {
	if (!State.value || !DrawState.value)
		return
	Renderer()
}

export function EntityCreate(x: Entity) {
	if (x instanceof Building)
		Fountains.push(x)
}
export function EntityDestroyed(x: Entity) {
	if (x instanceof Building)
		ArrayExtensions.arrayRemove(Fountains, x)
}

export function GameEnded() {
	Units = []
	Fountains = []
	Sleep.ResetTimer()
}