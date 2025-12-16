import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ash_legion_shield extends Modifier {
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK_SPECIAL,
			this.GetPhysicalConstantBlockSpecial.bind(this)
		]
	])
	public get StackCount(): number {
		return this.NetworkArmor || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [-this.cachedSpeed, false]
	}
	protected GetPhysicalConstantBlockSpecial(): [number, boolean] {
		return [this.NetworkArmor, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_ash_legion_shield"
		this.GetSpecialValue("block_amount", name) // only debug
		this.GetSpecialValue("block_radius", name) // only debug
		this.cachedSpeed = this.GetSpecialValue("slow", name)
	}
}
