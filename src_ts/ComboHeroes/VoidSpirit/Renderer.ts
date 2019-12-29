//@ts-nocheck
import { LocalPlayer } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { MouseTarget, Owner, initDrawBaseMap, initItemsMap, initAbilityMap } from "./Listeners"
import {
	State,
	Radius,
	DrawTargetItem,
	BlinkRadiusItemColor,
	DissimilateRadiusColor,
	ResonantPulseRadiusColor,
	AetherRemnanRadiusColor,
	AttackRangeRadius,
	RadiusColorAttackRange,
	AstralStepArmyRadiusColor
} from "./Menu"
export function Draw() {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || Owner === undefined)
		return
	let Particle = initDrawBaseMap.get(Owner),
		Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner)
	if (Items === undefined || Abilities === undefined || Particle === undefined)
		return
	Particle.RenderLineTarget(Base, DrawTargetItem, State, MouseTarget)
	Particle.RenderAttackRange(State, AttackRangeRadius, Owner.AttackRange, RadiusColorAttackRange.Color)
	Particle.Render(Abilities.AetherRemnan, "void_spirit_aether_remnant", Abilities.AetherRemnan.CastRange, Radius, State, AetherRemnanRadiusColor.Color)
	Particle.Render(Abilities.Dissimilate, "void_spirit_dissimilate", 785, Radius, State, DissimilateRadiusColor.Color)
	Particle.Render(Abilities.ResonantPulse, "void_spirit_resonant_pulse", Abilities.ResonantPulse.AOERadius, Radius, State, ResonantPulseRadiusColor.Color)
	Particle.Render(Abilities.AstralStep, "void_spirit_astral_step", Abilities.AstralStep.AOERadius, Radius, State, AstralStepArmyRadiusColor.Color)
	Particle.Render(Items.Blink, "item_blink", Items.Blink && Items.Blink.CastRange, Radius, State, BlinkRadiusItemColor.Color)
}
