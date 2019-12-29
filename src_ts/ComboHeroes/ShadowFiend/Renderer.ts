//@ts-nocheck
import { Base } from "./Extends/Helper"
import { LocalPlayer, Color, Ability, Hero, EntityManager } from "wrapper/Imports"
import { MouseTarget, Owner, initDrawMap, initItemsMap, initAbilityMap } from "./Listeners"
import { PredictionRize } from "./Module/Combo"
// import ShadowFiendAbility from "./Extends/Abilities"

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

	Particle.Render(Items.Blink, "item_blink", Items.Blink && Items.Blink.CastRange, Radius, State, BlinkRadiusItemColor.Color)
	Particle.Render(Items.Cyclone, "item_cyclone", Items.Cyclone && Items.Cyclone.CastRange, Radius, State, CycloneRadiusItemColor.Color)

	EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).some(enemy => {
		//DrawAutoSteal(Abilities, enemy)
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
		return raze_1 || raze_2 || raze_3
	})
}
/*

function DrawAutoSteal(Ability: ShadowFiendAbility, hero: Unit) {
	if (Owner === undefined || !hero.IsAlive) {
		return
	}
	// c + v
	let off_x: number,
		off_y: number,
		bar_w: number,
		bar_h: number,
		screen_size = RendererSDK.WindowSize,
		ratio = RendererSDK.GetAspectRatio()

	{
		if (ratio === "16x9") {
			off_x = screen_size.x * -0.0270
			off_y = screen_size.y * -0.02215
			bar_w = screen_size.x * 0.053
			bar_h = screen_size.y * 0.005
		} else if (ratio === "16x10") {
			off_x = screen_size.x * -0.02950
			off_y = screen_size.y * -0.02315
			bar_w = screen_size.x * 0.0583
			bar_h = screen_size.y * 0.0047
		} else if (ratio === "21x9") {
			off_x = screen_size.x * -0.020
			off_y = screen_size.y * -0.01715
			bar_w = screen_size.x * 0.039
			bar_h = screen_size.y * 0.007
		} else {
			off_x = screen_size.x * -0.038
			off_y = screen_size.y * -0.01715
			bar_w = screen_size.x * 0.075
			bar_h = screen_size.y * 0.0067
		}
	}
	let Abilities = Ability,
		ShadowRaze_1 = Abilities.Shadowraze1,
		ShadowRaze_2 = Abilities.Shadowraze2,
		ShadowRaze_3 = Abilities.Shadowraze3

	let ShadowRaze_1DMG = Owner.CalculateDamage(ShadowRaze_1.AbilityDamage, ShadowRaze_1.DamageType, hero),
		ShadowRaze_2DMG = Owner.CalculateDamage(ShadowRaze_2.AbilityDamage, ShadowRaze_2.DamageType, hero),
		ShadowRaze_3DMG = Owner.CalculateDamage(ShadowRaze_3.AbilityDamage, ShadowRaze_3.DamageType, hero)

	// don't worck AbilityDamage
	//console.log(ShadowRaze_1.AbilityDamage)

	if (!ShadowRaze_1.CanBeCasted()) {
		ShadowRaze_1DMG = 0
	}
	if (!ShadowRaze_2.CanBeCasted()) {
		ShadowRaze_2DMG = 0
	}
	if (!ShadowRaze_3.CanBeCasted()) {
		ShadowRaze_3DMG = 0
	}

	let Full_DMG = (ShadowRaze_1DMG + ShadowRaze_2DMG + ShadowRaze_3DMG)

	let wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))
	if (wts === undefined) {
		return
	}
	wts.AddScalarX(off_x).AddScalarY(off_y)
	let SizeSteal = Full_DMG / hero.HP
	if (SizeSteal === 0)
		return;

	let sizeBarX = 0;

	if (SizeSteal < 1) {
		colorBar.SetColor(74, 177, 48);
		SizeSteal = Full_DMG / hero.MaxHP;
		sizeBarX += bar_w * SizeSteal;
	}
	else {
		colorBar.SetColor(0, 255, 0);
		sizeBarX += hero.HP / hero.MaxHP * bar_w;
	}
	sizeBarX = Math.min(sizeBarX, bar_w);

	// colorBar ??? new color quest in moof
	RendererSDK.FilledRect(wts, new Vector2(sizeBarX, bar_h), colorBar)
}
*/
