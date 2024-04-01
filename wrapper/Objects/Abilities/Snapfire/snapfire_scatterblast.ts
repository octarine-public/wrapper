import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("snapfire_scatterblast")
export class snapfire_scatterblast extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("blast_width_end")
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("blast_speed", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("blast_width_initial", level)
	}
}
