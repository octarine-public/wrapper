import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_visage_summon_familiars_talents extends Modifier {
	private cachedDamage = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		this.UpdateSpecialValues()
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"bonus_damage",
			"visage_summon_familiars"
		)
	}
}
