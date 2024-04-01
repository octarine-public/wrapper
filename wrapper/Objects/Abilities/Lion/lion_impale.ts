import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lion_impale")
export class lion_impale extends Ability {
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius + this.GetSpecialValue("length_buffer")
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("width", level)
	}

	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
