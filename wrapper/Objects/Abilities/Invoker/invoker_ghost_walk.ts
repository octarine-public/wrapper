import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("invoker_ghost_walk")
export class invoker_ghost_walk extends Ability {
	@NetworkedBasicField("m_nQuasLevel")
	public QuasLevel = 0
	@NetworkedBasicField("m_nWexLevel")
	public WexLevel = 0
	@NetworkedBasicField("m_nExortLevel")
	public ExortLevel = 0
	public get IsInvisibility(): boolean {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
