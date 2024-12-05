import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_solar_crest extends Modifier {
	private cachedSpeed = 0
	private cachedArmor = 0

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
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_solar_crest"
		this.cachedArmor = this.GetSpecialValue("bonus_armor", name)
		this.cachedSpeed = this.GetSpecialValue("self_movement_speed", name)
	}
}
