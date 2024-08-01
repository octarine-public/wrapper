import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("terrorblade_sunder")
export class terrorblade_sunder extends Ability implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true
	public GetHealthRestore(_target: Unit): number {
		return 0
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
