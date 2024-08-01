import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Hero } from "../../Base/Hero"
import { Unit } from "../../Base/Unit"

@WrapperClass("witch_doctor_voodoo_restoration")
export class witch_doctor_voodoo_restoration
	extends Ability
	implements IHealthRestore<Unit>
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly HealthRestoreModifierName = "modifier_voodoo_restoration_heal"

	public GetHealthRestore(target: Unit): number {
		return this.healOnlySelf && target !== this.Owner
			? 0
			: this.GetSpecialValue("heal")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
	private get healOnlySelf() {
		const owner = this.Owner
		return owner instanceof Hero && owner.HeroFacetID === 2
	}
}
