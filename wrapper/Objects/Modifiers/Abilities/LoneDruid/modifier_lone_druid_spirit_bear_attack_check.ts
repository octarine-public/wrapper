import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { lone_druid_spirit_bear } from "../../../Abilities/LoneDruid/lone_druid_spirit_bear"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lone_druid_spirit_bear_attack_check extends Modifier {
	private cachedSpeed = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE,
			this.GetMoveSpeedBaseOverride.bind(this)
		]
	])

	// modifier is not update
	// force update cached special values because it's
	// has special_bonus_unique_lone_druid_11
	public PostDataUpdate(): void {
		this.UpdateSpecialValues()
	}

	protected GetMoveSpeedBaseOverride(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof lone_druid_spirit_bear) {
			this.cachedSpeed = this.GetSpecialValue("bear_movespeed", this.Ability.Name)
		}
	}
}
