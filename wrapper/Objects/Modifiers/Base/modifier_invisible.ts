import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { mirana_invis } from "../../Abilities/Mirana/mirana_invis"
import { riki_backstab } from "../../Abilities/Riki/riki_backstab"
import { Modifier } from "../../Base/Modifier"
import { item_glimmer_cape } from "../../Items/item_glimmer_cape"

@WrapperClassModifier()
export class modifier_invisible extends Modifier {
	private cachedSpeedConstant = 0
	private cachedSpeedPercentage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedSpeedConstant, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeedPercentage, false]
	}

	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof riki_backstab) {
			const talent = this.Parent?.GetAbilityByName(
				"special_bonus_unique_riki_8"
			)?.GetSpecialValue("value")
			this.cachedSpeedPercentage = talent ?? 0
		}
		if (this.Ability instanceof mirana_invis) {
			this.cachedSpeedPercentage = this.GetSpecialValue(
				"bonus_movement_speed",
				this.Ability.Name
			)
		}
		if (this.Ability instanceof item_glimmer_cape) {
			this.cachedSpeedConstant = this.GetSpecialValue(
				"active_movement_speed",
				this.Ability.Name
			)
		}
	}
}
