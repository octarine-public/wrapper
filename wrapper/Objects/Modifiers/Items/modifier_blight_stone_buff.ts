import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_blight_stone_buff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedArmor = 0
	private isCorrosion = false

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	public IsDebuff(): this is IDebuff {
		return true
	}
	public PostDataUpdate(): void {
		this.isCorrosion =
			this.Parent?.HasBuffByName("modifier_orb_of_corrosion_debuff") ?? false
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, this.isCorrosion]
	}
	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("corruption_armor", "item_blight_stone")
	}
}
