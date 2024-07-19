import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_Pudge_MeatHook")
export class pudge_meat_hook extends Ability {
	@NetworkedBasicField("m_nConsecutiveHits")
	public ConsecutiveHits = 0

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("hook_width", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("hook_speed", level)
	}
}
