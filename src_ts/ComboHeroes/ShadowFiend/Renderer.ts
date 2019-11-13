import { Base } from "./Extends/Helper"
import { LocalPlayer, Color, Ability, Hero } from "wrapper/Imports"
import { MouseTarget, Owner, initDrawMap, initItemsMap, initAbilityMap, Heroes } from "./Listeners"
import { PredictionRize } from "./Module/Combo"

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
	ShadowRaze1Radius,
	ShadowRaze2Radius,
	ShadowRaze3Radius
} from "./Menu"

const prdictPos = (abil: Ability, enemy: Hero) =>
	PredictionRize(abil, enemy, abil.GetSpecialValue("shadowraze_radius"))

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
	Particle.RenderLineTarget(Base, DrawingStatus, State, MouseTarget)
	Particle.RenderAttackRange(State, AttackRangeRadius, Owner.AttackRange, RadiusColorAttackRange.Color)

	Particle.Render(Items.Blink, "item_blink", Items.Blink && Items.Blink.AOERadius + Owner.CastRangeBonus, Radius, State, BlinkRadiusItemColor.Color)
	Particle.Render(Items.Cyclone, "item_cyclone", Items.Cyclone && Items.Cyclone.CastRange + Owner.CastRangeBonus, Radius, State, CycloneRadiusItemColor.Color)

	Heroes.some(enemy => {
		if (!enemy.IsEnemy() || !enemy.IsVisible)
			return;

		let raze_1 = prdictPos(Abilities.Shadowraze1, enemy),
			raze_2 = prdictPos(Abilities.Shadowraze2, enemy),
			raze_3 = prdictPos(Abilities.Shadowraze3, enemy)

		Particle.Render(
			Abilities.Shadowraze1,
			Abilities.Shadowraze1.toString(),
			ShadowRaze1Radius.value,
			Radius, State,
			raze_1 ? Color.Green : ShadowRaze1RadiusColor.Color,
			Owner.InFront(Abilities.Shadowraze1.CastRange)
		)

		Particle.Render(
			Abilities.Shadowraze2,
			Abilities.Shadowraze2.toString(),
			ShadowRaze2Radius.value,
			Radius, State,
			raze_2 ? Color.Green : ShadowRaze2RadiusColor.Color,
			Owner.InFront(Abilities.Shadowraze2.CastRange)
		)
		Particle.Render(
			Abilities.Shadowraze3,
			Abilities.Shadowraze3.toString(),
			ShadowRaze3Radius.value,
			Radius, State,
			raze_3 ? Color.Green : ShadowRaze3RadiusColor.Color,
			Owner.InFront(Abilities.Shadowraze3.CastRange)
		)

		return raze_1 || raze_2 || raze_3;
	})
}