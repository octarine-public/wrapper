import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("morphling_morph_str")
export class morphling_morph_str extends Ability implements IHealthRestore<Unit> {
	public readonly RestoresAlly = false
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly HealthRestoreModifierName = "modifier_morphling_morph_str"

	public HealthGain(seconds: number) {
		// todo: move to HealthRestore ?
		return this.GetSpecialValue("morph_rate_tooltip") * seconds * 22
	}
	public GetHealthRestore(_target: Unit): number {
		return 0
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
