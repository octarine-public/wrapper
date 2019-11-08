
import { Base } from "./Extends/Helper"
import { LocalPlayer } from "wrapper/Imports"
import { Owner, initItemsMap, initAbilityMap, initDrawMap, MouseTarget } from "./Listeners"

import {
	State,
	Radius,
	DrawTargetItem,
	DuelRadiusItemColor,
	BlinkRadiusItemColor,
	OverwhelmingOddsRadiusColor,
	PressTheAttackRadiusItemColor,
	AttackRangeRadius,
	RadiusColorAttackRange
} from "./Menu"

export function Draw() {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || Owner === undefined) {
		return
	}
	let Particle = initDrawMap.get(Owner),
		Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner)

	if (Items === undefined || Abilities === undefined || Particle === undefined) {
		return
	}
	// Particle Render
	Particle.RenderLineTarget(Base, DrawTargetItem, State, MouseTarget)
	Particle.RenderAttackRange(State, AttackRangeRadius, Owner.AttackRange, RadiusColorAttackRange.Color)
	Particle.Render(Abilities.Duel, "legion_commander_duel", Abilities.Duel.CastRange, Radius, State, DuelRadiusItemColor.Color)
	Particle.Render(Items.Blink, "item_blink", (Items.Blink && Items.Blink.AOERadius + Owner.CastRangeBonus), Radius, State, BlinkRadiusItemColor.Color)
	Particle.Render(Abilities.Overwhelming, "lina_light_strike_array", Abilities.Overwhelming.CastRange, Radius, State, OverwhelmingOddsRadiusColor.Color)
	Particle.Render(Abilities.PressTheAttack, "legion_commander_press_the_attack", Abilities.PressTheAttack.CastRange, Radius, State, PressTheAttackRadiusItemColor.Color)
}
