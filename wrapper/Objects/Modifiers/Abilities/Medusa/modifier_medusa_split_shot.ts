import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_medusa_split_shot extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackDamagePercentage.bind(this)
		]
	])
	public get ForceVisible(): boolean {
		return true
	}
	protected GetPreAttackDamagePercentage(): [number, boolean] {
		return [this.cachedDamage, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("damage_modifier", "medusa_split_shot")
	}
}
