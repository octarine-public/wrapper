import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("zuus_lightning_bolt")
export class zuus_lightning_bolt extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("spread_aoe", level)
	}
}
