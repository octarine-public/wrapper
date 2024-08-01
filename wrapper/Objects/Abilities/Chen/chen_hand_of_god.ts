import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("chen_hand_of_god")
export class chen_hand_of_god extends Ability implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("heal_amount")
	}
	public GetBaseAOERadiusForLevel(_level: number): number {
		return 99999
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
