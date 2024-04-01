import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("queenofpain_sonic_wave")
export class queenofpain_sonic_wave extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("final_aoe")
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("starting_aoe", level)
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
