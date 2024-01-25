import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_winter_wyvern_arctic_burn_flight extends Modifier {
	public get ShouldDoFlyHeightVisual(): boolean {
		return true
	}

	public SetBonusNightVision(
		specialName = "night_vision_bonus",
		subtract = false
	): void {
		super.SetBonusNightVision(specialName, subtract)
	}

	public SetBonusAttackRange(
		specialName = "attack_range_bonus",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
