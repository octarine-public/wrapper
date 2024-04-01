import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bane_brain_sap")
export class bane_brain_sap extends Ability {
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("brain_sap_damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("shard_radius", level)
	}
}
