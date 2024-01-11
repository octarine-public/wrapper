import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_night_stalker_void_zone extends Modifier {
	public readonly IsBuff = true

	protected UnitPropertyChanged(changed?: boolean): boolean {
		if (!super.UnitPropertyChanged(changed)) {
			return false
		}
		const owner = this.Parent
		if (owner === undefined) {
			return false
		}
		const buffName = "modifier_night_stalker_hunter_in_the_night"
		const getBuffByName = owner.GetBuffByName(buffName)
		getBuffByName?.Update()
		getBuffByName?.OnUnitStateChaged()
		return true
	}
}
