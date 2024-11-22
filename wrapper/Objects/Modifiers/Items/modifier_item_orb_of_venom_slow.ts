import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_orb_of_venom_slow extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeedMelee = 0
	private cachedSpeedRanged = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const caster = this.Caster
		if (caster === undefined) {
			return [0, false]
		}
		const value = this.HasMeleeAttacksBonuses(caster)
			? this.cachedSpeedMelee
			: this.cachedSpeedRanged
		return [value, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		const name = "item_orb_of_venom"
		this.cachedSpeedMelee = this.GetSpecialValue("poison_movement_speed_melee", name)
		this.cachedSpeedRanged = this.GetSpecialValue("poison_movement_speed_range", name)
	}
}
