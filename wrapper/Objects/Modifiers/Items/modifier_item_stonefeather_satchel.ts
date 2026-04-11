import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EStoneFeatherAttribute } from "../../../Enums/EStoneFeather"
import { Modifier } from "../../Base/Modifier"
import { item_stonefeather_satchel } from "../../Items/item_stonefeather_satchel"

@WrapperClassModifier()
export class modifier_item_stonefeather_satchel extends Modifier {
	private cachedSpeed = 0
	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	protected GetPhysicalArmorBonus(): [number, boolean] {
		if (!(this.Ability instanceof item_stonefeather_satchel)) {
			return [0, false]
		}
		switch (this.Ability.ActiveAttribute) {
			case EStoneFeatherAttribute.STONE:
				return [this.cachedArmor, false]
			case EStoneFeatherAttribute.FEATHERS:
				return [0, false]
			default:
				return [0, false]
		}
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		if (!(this.Ability instanceof item_stonefeather_satchel)) {
			return [0, false]
		}
		switch (this.Ability.ActiveAttribute) {
			case EStoneFeatherAttribute.STONE:
				return [0, false]
			case EStoneFeatherAttribute.FEATHERS:
				return [this.cachedSpeed, false]
			default:
				return [0, false]
		}
	}
	protected UpdateSpecialValues(): void {
		const name = "item_stonefeather_satchel"
		this.cachedSpeed = this.GetSpecialValue("feather_movespeed", name)
		this.cachedArmor = this.GetSpecialValue("feather_armor", name)
	}
}
