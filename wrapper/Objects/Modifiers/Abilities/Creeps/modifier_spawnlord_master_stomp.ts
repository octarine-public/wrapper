import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spawnlord_master_stomp extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedArmorBase = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE,
			this.GetPhysicalArmorBasePercentage.bind(this)
		]
	])

	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetPhysicalArmorBasePercentage(): [number, boolean] {
		return [100 - this.cachedArmorBase, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedArmorBase = this.GetSpecialValue(
			"armor_reduction_pct",
			"spawnlord_master_stomp"
		)
	}
}
