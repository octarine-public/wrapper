import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_bloodseeker_bloodrage extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedAttackSpeed = 0
	private cachedSpellAmplify = 0
	private cachedBaseDamageAmp = 0
	private cachedBonusDamagePctHP = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE,
			this.GetPreAttackBonusDamagePure.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		return [this.cachedBaseDamageAmp, false]
	}
	protected GetPreAttackBonusDamagePure(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const owner = this.Parent,
			target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || owner === undefined) {
			return [0, false]
		}
		return [(this.cachedBonusDamagePctHP * target.MaxHP) / 100, false]
	}
	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [this.cachedSpellAmplify, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "bloodseeker_bloodrage"
		this.cachedSpellAmplify = this.GetSpecialValue("spell_amp", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed", name)
		this.cachedBaseDamageAmp = this.GetSpecialValue("base_damage_amp", name)
		this.cachedBonusDamagePctHP = this.GetSpecialValue("max_health_dmg_pct", name)
	}
}
