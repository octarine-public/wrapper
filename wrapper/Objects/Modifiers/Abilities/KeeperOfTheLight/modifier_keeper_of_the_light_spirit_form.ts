import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { modifier_keeper_of_the_light_bright_speed } from "./modifier_keeper_of_the_light_bright_speed"

@WrapperClassModifier()
export class modifier_keeper_of_the_light_spirit_form extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
			this.GetCastRangeBonusStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetCastRangeBonusStacking(): [number, boolean] {
		return [this.cachedCastRange, false]
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const modifier = owner.GetBuffByClass(modifier_keeper_of_the_light_bright_speed)
		if (modifier === undefined) {
			return [0, false]
		}
		const speed = modifier.GetBonusMovementSpeed()[0]
		return [(speed * this.cachedSpeed) / 100, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "keeper_of_the_light_spirit_form"
		this.cachedSpeed = this.GetSpecialValue("movement_speed", name)
		this.cachedCastRange = this.GetSpecialValue("cast_range", name)
	}
}
