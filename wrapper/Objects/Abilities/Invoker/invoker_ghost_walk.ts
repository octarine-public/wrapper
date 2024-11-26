import { WrapperClass } from "../../../Decorators"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_ghost_walk")
export class invoker_ghost_walk extends invoker_spell_extends {
	public get IsInvisibility(): boolean {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}
}
