import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_marci_bodyguarded extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0
	private cachedPenaltyDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined) {
			return [0, false]
		}
		const damage = (this.cachedDamage * (params.RawDamageBase ?? 0)) / 100
		return [(damage * this.cachedPenaltyDamage) / 100, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "marci_bodyguard"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedPenaltyDamage = this.GetSpecialValue("max_partner_penalty", name)
	}
}
