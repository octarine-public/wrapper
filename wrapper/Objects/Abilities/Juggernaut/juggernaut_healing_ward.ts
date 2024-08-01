import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("juggernaut_healing_ward")
export class juggernaut_healing_ward extends Ability implements IHealthRestore<Unit> {
	public RestoresAlly = false
	public RestoresSelf = false
	public InstantRestore = false
	public readonly HealthRestoreModifierName = "modifier_juggernaut_healing_ward_heal"

	public GetHealthRestore(target: Unit): number {
		return (
			target.MaxHP *
			this.MaxDuration *
			(this.GetSpecialValue("healing_ward_heal_amount") / 100)
		)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("healing_ward_aura_radius", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
