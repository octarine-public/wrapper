import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pudge_rotten_core extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0

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
		if (params === undefined) {
			return [0, false]
		}
		const pct = (this.cachedDamage * this.StackCount) / 100
		return [(params.RawDamageBase ?? 0) * pct, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("attack_damage_per_stack", "pudge_rot")
	}
}
