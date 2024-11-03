import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { mirana_invis } from "../../Abilities/Mirana/mirana_invis"
import { riki_backstab } from "../../Abilities/Riki/riki_backstab"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invisible extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof riki_backstab) {
			const talent = this.Parent?.GetAbilityByName(
				"special_bonus_unique_riki_8"
			)?.GetSpecialValue("value")
			this.cachedSpeed = talent ?? 0
		}
		if (this.Ability instanceof mirana_invis) {
			this.cachedSpeed = this.GetSpecialValue(
				"bonus_movement_speed",
				this.Ability.Name
			)
		}
	}
}
