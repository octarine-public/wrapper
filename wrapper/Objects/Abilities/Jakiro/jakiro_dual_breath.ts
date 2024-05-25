import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("jakiro_dual_breath")
export class jakiro_dual_breath extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("start_radius", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
