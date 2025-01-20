import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_craggy_coat_tanky extends Modifier {
	private cachedArmor = 0
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [-this.cachedSpeed, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_craggy_coat"
		this.cachedSpeed = this.GetSpecialValue("move_speed", name)
		this.cachedArmor = this.GetSpecialValue("active_armor", name)
	}
}
