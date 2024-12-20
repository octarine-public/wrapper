import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dandelion_amulet extends Modifier {
	private cachedSpeed = 0
	private cachedMinDamage = 0
	private cachedBlockDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_RAW_MAGICAL_CONSTANT_BLOCK,
			this.GetMagicalConstantBlock.bind(this)
		]
	])

	protected GetMagicalConstantBlock(params?: IModifierParams): [number, boolean] {
		if (params === undefined || params.RawDamage === undefined) {
			return [0, false]
		}
		const ability = this.Ability
		if (ability === undefined || !ability.IsReady) {
			return [0, false]
		}
		if (params.RawDamage < this.cachedMinDamage) {
			return [0, false]
		}
		return [this.cachedBlockDamage, false]
	}

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_dandelion_amulet"
		this.cachedSpeed = this.GetSpecialValue("move_speed", name)
		this.cachedMinDamage = this.GetSpecialValue("min_damage", name)
		this.cachedBlockDamage = this.GetSpecialValue("magic_block", name)
	}
}
