import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_broodmother_insatiable_hunger extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0
	private cachedAdjustBAT = 0
	private cachedShardDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT_ADJUST,
			this.GetBaseAttackTimeConstantAdjust.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamagePercentage(
		_params?: IModifierParams
	): [number, boolean] {
		const bonusDamage = Math.floor(this.ElapsedTime) * this.cachedShardDamage
		return [this.cachedDamage + bonusDamage, false]
	}
	protected GetBaseAttackTimeConstantAdjust(): [number, boolean] {
		return [this.cachedAdjustBAT, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "broodmother_insatiable_hunger"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedAdjustBAT = this.GetSpecialValue("bat_bonus", name)
		this.cachedShardDamage = this.GetSpecialValue("shard_damage_per_tick", name)
	}
}
