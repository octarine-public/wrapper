import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { lone_druid_savage_roar_bear } from "../../../Abilities/LoneDruid/lone_druid_savage_roar_bear"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lone_druid_spirit_bear_attack_check extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE,
			this.GetMoveSpeedBaseOverride.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBaseOverride(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof lone_druid_savage_roar_bear) {
			this.cachedSpeed = this.GetSpecialValue("bear_movespeed", this.Ability.Name)
		}
	}
}
