import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("kunkka_ghostship")
export class kunkka_ghostship extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("ghostship_width", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
