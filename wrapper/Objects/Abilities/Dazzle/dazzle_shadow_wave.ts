import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("dazzle_shadow_wave")
export class dazzle_shadow_wave extends Ability implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("damage_radius", level)
	}
	public GetHealthRestore(_target: Unit): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const restoreVal = this.AbilityDamage
		const scepterPct = this.GetSpecialValue("scepter_heal_pct") // 150%
		return !owner.HasScepter ? restoreVal : restoreVal * (scepterPct / 100)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
