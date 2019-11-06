import { Color, RendererSDK, Vector2 } from "../../wrapper/Imports"
import InitDrawBase from "../Base/DrawDotTarget"
import InitAbility from "./Extends/Abilities"
import { Base } from "./Extends/Helper"
import { Heroes, MouseTarget, Owner } from "./Listeners"
import { AutoStealAbility, AutoStealState, DrawingStatus, DrawingStatusKillSteal, State } from "./Menu"

export function Draw() {
	let Drawing = new InitDrawBase(Owner, MouseTarget)
	if (!DrawingStatus.value) {
		Drawing.ResetEnemyParticle()
	}
	if (Drawing !== undefined && DrawingStatus.value) {
		Drawing.DrawTarget(Base, State)
	}
	if (AutoStealState.value && State.value && DrawingStatusKillSteal.value) {
		DrawAutoSteal()
	}
}
function DrawAutoSteal() {
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
		let Abilities = new InitAbility(Owner),
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

export function DrawDeleteTempAllVars() {
	new InitDrawBase().ResetEnemyParticle()
}