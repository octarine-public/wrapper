import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_largo_song_speed_burst_slowres extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSlowResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSlowResist, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedSlowResist = this.GetSpecialValue(
			"slow_resistance",
			"largo_song_double_time"
		)
	}
}
