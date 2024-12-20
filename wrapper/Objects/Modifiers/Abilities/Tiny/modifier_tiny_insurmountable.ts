import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_tiny_insurmountable extends Modifier {
	private cachedSlowResist = 0
	private cachedStatusResist = 0

	private slowResist = 0
	private statusResist = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE,
			this.GetStatusResistance.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined || this.IsPassiveDisabled()) {
			this.cachedSlowResist = 0
			this.cachedStatusResist = 0
			return
		}
		this.cachedSlowResist = this.getResistance(owner, this.slowResist)
		this.cachedStatusResist = this.getResistance(owner, this.statusResist)
	}

	protected GetStatusResistance(): [number, boolean] {
		return [this.cachedStatusResist, false]
	}

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSlowResist, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "tiny_insurmountable"
		this.slowResist = this.GetSpecialValue("str_to_slow_resist_pct", name)
		this.statusResist = this.GetSpecialValue("str_to_status_resist_pct", name)
	}

	private getResistance(owner: Unit, value: number): number {
		return (owner.TotalStrength * value) / 100
	}
}
