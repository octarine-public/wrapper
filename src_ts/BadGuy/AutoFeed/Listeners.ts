import { Building, Unit, EntityManager, Entity, ArrayExtensions, GameSleeper, Vector3, Hero } from "wrapper/Imports"
import { DrawState, State, SwitchUnit, LogicFeedHeroState, arr_hero } from "./Menu"
import { Renderer } from "./Renderer"
import { Utility } from "../Base/Utils"

let Sleeper = new GameSleeper()
let Fountains: Building[] = []
export let Units: Unit[] = []

function UseAbilites(unit: Unit, name: string, Position?: Vector3 | Unit): boolean {
	let abil = unit.GetAbilityByName(name)
	if (abil === undefined || Sleeper.Sleeping(abil))
		return false

	if (abil.Level <= 0) {
		abil.UpgradeAbility()
		Sleeper.Sleep(Utility.GetDelayCast, abil)
	}

	if (!abil.CanBeCasted() || abil.IsChanneling || abil.IsInAbilityPhase)
		return false

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
		abil.UseAbility()
		Sleeper.Sleep(Utility.GetDelayCast, abil)
	}

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE)) {
		abil.UseAbility(unit, true)
		Sleeper.Sleep(Utility.GetDelayCast, abil)
	}

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) || abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)) {
		abil.UseAbility(Position)
		Sleeper.Sleep(Utility.GetDelayCast, abil)
	}
	return true
}

function Feedlogic(unit: Unit, enemy_base: Building) {
	switch (unit.Name) {
		case arr_hero[0]:
			if (!UseAbilites(unit, "lycan_summon_wolves"))
				return
			break
		case arr_hero[1]:
			if (!UseAbilites(unit, "lone_druid_spirit_bear"))
				return
			break
		case arr_hero[2]:
			if (!UseAbilites(unit, "furion_teleportation", enemy_base.Position))
				return
			break
		case arr_hero[3]:
			if (!UseAbilites(unit, "windrunner_windrun"))
				return
			break
		case arr_hero[4]:
			if (!UseAbilites(unit, "beastmaster_call_of_the_wild_boar"))
				return
			break
		case arr_hero[5]:
			if (!UseAbilites(unit, "brewmaster_drunken_brawler"))
				return
			break
		case arr_hero[6]:
			if (!UseAbilites(unit, "pudge_rot"))
				return
			break
		case arr_hero[7]:
			if (!UseAbilites(unit, "queenofpain_blink", enemy_base.Position))
				return
			break
		case arr_hero[8]:
			if (!UseAbilites(unit, "antimage_blink", enemy_base.Position))
				return
			break
		case arr_hero[9]:
			if (!UseAbilites(unit, "grimstroke_spirit_walk", unit))
				return
			break
		default: return
	}
}

function MoveUnit(unit: Unit) {
	if (Sleeper.Sleeping(unit))
		return false
	return Fountains.some(fnt => {
		if (fnt === undefined || !fnt.Name.includes("fountain"))
			return false
		let tp = unit.Inventory.TotalItems.find(item => item?.Name === "item_tpscroll")
		if (tp === undefined
			&& unit.HasBuffByName("modifier_fountain_aura_buff")
			&& !fnt.IsEnemy() && unit.IsInRange(fnt.Position, 1000)
		) {
			// TODO: PurchaseItem (don't work)
			// unit.PurchaseItem(46)
			// Sleep.Sleep(B_Utils.GetDelayCast)

		} else if (fnt.IsEnemy() && tp?.CanBeCasted()) {
			unit.CastPosition(tp, fnt.Position)
			Sleeper.Sleep(Utility.GetDelayCast, unit)
		}
		if (!fnt.IsEnemy())
			return false

		if (LogicFeedHeroState.IsEnabled(unit.Name))
			Feedlogic(unit, fnt)

		if (unit.IsMoving)
			return false
		unit.MoveTo(fnt.Position)
		Sleeper.Sleep(Utility.GetDelayCast, unit)
		return true
	})
}

function Switch(unit: Unit) {
	if (!unit.IsVisible || unit.HasBuffByName("modifier_teleporting"))
		return false
	switch (SwitchUnit.selected_id) {
		case 0: return unit instanceof Hero && MoveUnit(unit)
		case 1: return MoveUnit(unit)
	}
}
export const filterUnits = (x: Unit) =>
	!x.IsEnemy()
	&& x.IsAlive
	&& x.IsControllable
	&& !x.IsHexed
	&& !x.IsStunned && !x.IsChanneling

export function Tick() {
	if (!State.value)
		return
	Units = EntityManager.GetEntitiesByClass(Unit)
	if (Units.some(x => filterUnits(x) && Switch(x)))
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
	Sleeper.FullReset()
}
