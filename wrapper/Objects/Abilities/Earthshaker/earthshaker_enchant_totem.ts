import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_earthshaker_aftershock } from "../../Modifiers/Abilities/Earthshaker/modifier_earthshaker_aftershock"

@WrapperClass("earthshaker_enchant_totem")
export class earthshaker_enchant_totem extends Ability implements INuke {
	public HasModifier = false

	public get ScepterRadius() {
		return this.GetSpecialValue("scepter_cleave_distance")
	}
	public get DamageType() {
		return this.HasModifier
			? DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
			: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
	private get aftershockAOEDamage() {
		const aftershock = this.Owner?.GetBuffByClass(modifier_earthshaker_aftershock)
		return aftershock?.AOEDamage ?? 0
	}
	private get aftershockBonusAOERadius() {
		const aftershock = this.Owner?.GetBuffByClass(modifier_earthshaker_aftershock)
		return aftershock?.AOERadiusBonus ?? 0
	}
	public get AOERadius(): number {
		return this.GetBaseAOERadiusForLevel(this.Level) + this.aftershockBonusAOERadius
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("distance_scepter", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		const aftershock = this.Owner?.GetAbilityByName("earthshaker_aftershock")
		return aftershock?.GetBaseAOERadiusForLevel(level) ?? 0
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		return this.HasModifier
			? owner.GetRawAttackDamage(target)
			: this.aftershockAOEDamage
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		if (!this.HasModifier) {
			return super.GetDamage(target)
		}
		return owner.GetAttackDamage(
			target,
			ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN,
			this.GetRawDamage(target)
		)
	}
}
