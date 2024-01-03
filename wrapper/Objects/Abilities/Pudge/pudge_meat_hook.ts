import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("pudge_meat_hook")
@WrapperClass("CDOTA_Ability_Pudge_MeatHook")
export class pudge_meat_hook extends Ability {
	@NetworkedBasicField("m_nConsecutiveHits")
	public ConsecutiveHits = 0

	public get Speed(): number {
		return this.GetSpecialValue("hook_speed")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("hook_width", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
