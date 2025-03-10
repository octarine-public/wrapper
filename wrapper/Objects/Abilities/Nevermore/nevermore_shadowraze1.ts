import { WrapperClass } from "../../../Decorators"
import { modifier_nevermore_shadowraze_debuff } from "../../../Objects/Modifiers/Abilities/Nevermore/modifier_nevermore_shadowraze_debuff"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("nevermore_shadowraze1")
export class nevermore_shadowraze1 extends Ability {
	public get UsesRotation() {
		return this.NoTarget
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("shadowraze_range", level)
	}
	public GetCastRangeForLevel(level: number): number {
		return this.GetBaseCastRangeForLevel(level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("shadowraze_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("shadowraze_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		return super.GetRawDamage(target) + this.bonusPerStack(target)
	}

	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		return super.GetDamage(target) + owner.GetAttackDamage(target)
	}

	private bonusPerStack(target: Unit) {
		const modifier = target.GetBuffByClass(modifier_nevermore_shadowraze_debuff)
		return modifier?.BonusDamagePerStack ?? 0
	}
}
