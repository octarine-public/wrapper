import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_marci_guardian_buff extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0
	private cachedDamagePenalty = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamagePercentage(
		params?: IModifierParams
	): [number, boolean] {
		const owner = this.Parent,
			caster = this.Caster
		if (params === undefined || owner === undefined || caster === undefined) {
			return [0, false]
		}
		if (owner !== caster) {
			return this.NetworkIsActive ? [this.cachedDamage, false] : [0, false]
		}
		return this.NetworkIsActive
			? [this.cachedDamage, false]
			: [this.cachedDamage * (1 - this.cachedDamagePenalty / 100), false]
	}
	protected UpdateSpecialValues(): void {
		const name = "marci_guardian"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedDamagePenalty = this.GetSpecialValue("max_partner_penalty", name)
	}
}
