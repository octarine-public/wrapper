import { Base } from "./Extends/Helper"
import { LocalPlayer } from "wrapper/Imports"
import { MouseTarget, Owner, initDrawMap, initItemsMap, initAbilityMap } from "./Listeners"
import {
	DrawingStatus,
	State, Radius,
	BlinkRadiusItemColor,
	AttackRangeRadius,
	RadiusColorAttackRange,
	CycloneRadiusItemColor,
	ShadowRaze1RadiusColor,
	ShadowRaze2RadiusColor,
	ShadowRaze3RadiusColor,
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
	// let array_raze: Ability[] = [
	// 	Abilities.Shadowraze1,
	// 	Abilities.Shadowraze2,
	// 	Abilities.Shadowraze3
	// ]
	// Particle Render
	Particle.RenderLineTarget(Base, DrawingStatus, State, MouseTarget)
	Particle.RenderAttackRange(State, AttackRangeRadius, Owner.AttackRange, RadiusColorAttackRange.Color)

	// array_raze.filter((abil, i) => {
	// 	if (abil !== undefined) {
	// 		Particle.Render(
	// 			abil, "nevermore_shadowraze_" + i,
	// 			Abilities.Shadowraze1.CastRange + (Owner.HullRadius * 2),
	// 			Radius, State,
	// 			ShadowRaze1RadiusColor.Color,
	//			Owner.InFront(abil.CastRange)
	// 		)
	// 	}
	// })
	Particle.Render(
		Abilities.Shadowraze1,
		"nevermore_shadowraze1",
		Abilities.Shadowraze1.CastRange + (Owner.HullRadius * 2),
		Radius, State,
		ShadowRaze1RadiusColor.Color,
		Owner.InFront(Abilities.Shadowraze1.CastRange)
	)
	Particle.Render(
		Abilities.Shadowraze2,
		"nevermore_shadowraze2",
		Abilities.Shadowraze1.CastRange + (Owner.HullRadius * 2),
		Radius, State,
		ShadowRaze2RadiusColor.Color,
		Owner.InFront(Abilities.Shadowraze2.CastRange)
	)
	Particle.Render(
		Abilities.Shadowraze3,
		"nevermore_shadowraze3",
		Abilities.Shadowraze1.CastRange + (Owner.HullRadius * 2),
		Radius, State,
		ShadowRaze3RadiusColor.Color,
		Owner.InFront(Abilities.Shadowraze3.CastRange)
	)

	Particle.Render(Items.Blink, "item_blink", Items.Blink && Items.Blink.AOERadius + Owner.CastRangeBonus, Radius, State, BlinkRadiusItemColor.Color)
	Particle.Render(Items.Cyclone, "item_cyclone", Items.Cyclone && Items.Cyclone.CastRange + Owner.CastRangeBonus, Radius, State, CycloneRadiusItemColor.Color)
}