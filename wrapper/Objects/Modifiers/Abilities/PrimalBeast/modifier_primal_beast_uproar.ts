import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_uproar extends Modifier {
	private cachedArmor = 0
	private cachedArmorValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent,
			modifierName = "modifier_primal_beast_roared_self"
		if (owner === undefined || !owner.HasBuffByName(modifierName)) {
			this.cachedArmor = 0
			return
		}
		this.cachedArmor = this.cachedArmorValue * this.StackCount
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedArmorValue = this.GetSpecialValue(
			"roared_bonus_armor",
			"primal_beast_uproar"
		)
	}
}
