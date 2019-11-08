import { Base } from "./Extends/Helper"
import LinaAbility from "./Extends/Abilities"
import { Color, RendererSDK, Vector2, LocalPlayer, Game } from "wrapper/Imports"
import { Heroes, MouseTarget, Owner, initDrawMap, initItemsMap, initAbilityMap } from "./Listeners"

import {
	State,
	Radius,
	AutoStealAbility,
	AutoStealState,
	DrawingStatus,
	DrawingStatusKillSteal,
	BlinkRadiusItemColor,
	DragonSlaveRadiusColor, LightStrikeArrayColor,
	LagunaBladeColor,
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
	Particle.RenderLineTarget(Base, DrawingStatus, State, MouseTarget)
	Particle.RenderAttackRange(State, AttackRangeRadius, Owner.AttackRange, RadiusColorAttackRange.Color)
	Particle.Render(Abilities.LagunaBlade, "lina_laguna_blade", Abilities.LagunaBlade.CastRange, Radius, State, LagunaBladeColor.Color)
	Particle.Render(Abilities.DragonSlave, "lina_dragon_slave", Abilities.DragonSlave.CastRange, Radius, State, DragonSlaveRadiusColor.Color)
	Particle.Render(Items.Blink, "item_blink", Items.Blink && Items.Blink.AOERadius + Owner.CastRangeBonus, Radius, State, BlinkRadiusItemColor.Color)
	Particle.Render(Abilities.LightStrikeArray, "lina_light_strike_array", Abilities.LightStrikeArray.CastRange, Radius, State, LightStrikeArrayColor.Color)

	if (Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME) {
		return
	}
	// Screen Render
	if (AutoStealState.value && State.value && DrawingStatusKillSteal.value) {
		DrawAutoSteal(Abilities)
	}
}

function DrawAutoSteal(Ability: LinaAbility) {
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

	Heroes.forEach(hero => {
		let wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))
		if (wts === undefined || !hero.IsEnemy() || !hero.IsAlive || !hero.IsVisible) {
			return
		}
		if (Owner === undefined) {
			return
		}
		let Abilities = Ability,
			DMG_TYPE_LAGUNA = Owner.HasScepter
				? DAMAGE_TYPES.DAMAGE_TYPE_PURE
				: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
			Laguna = Abilities.LagunaBlade,
			DraGonSlave = Abilities.DragonSlave,
			StealDMDraGonSlave = Owner.CalculateDamage(DraGonSlave.AbilityDamage, DraGonSlave.DamageType, hero),
			StealDMGLaguna = Owner.CalculateDamage(Laguna.AbilityDamage, DMG_TYPE_LAGUNA, hero)

		if (!Laguna.CanBeCasted() || !AutoStealAbility.IsEnabled(Laguna.Name)) {
			StealDMGLaguna = 0
		}
		if (!DraGonSlave.CanBeCasted() || !AutoStealAbility.IsEnabled(DraGonSlave.Name)) {
			StealDMDraGonSlave = 0
		}

		wts.AddScalarX(off_x).AddScalarY(off_y)
		let size = new Vector2(bar_w, bar_h)
		RendererSDK.FilledRect(wts, size, new Color(0, 0, 0, 165))
		let SizeSteal = (StealDMDraGonSlave + StealDMGLaguna) / hero.HP
		size.MultiplyScalarForThis(SizeSteal >= 1 ? 1 : SizeSteal)
		size.SetY(bar_h)
		RendererSDK.FilledRect(wts, size, new Color(0, 255, 0, 100))
	})
}