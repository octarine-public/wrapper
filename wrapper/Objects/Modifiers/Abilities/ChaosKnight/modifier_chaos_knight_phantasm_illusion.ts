import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_chaos_knight_phantasm_illusion extends Modifier {
	private cachedIncomingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	public UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		const state = (changed ??= true)
		if (owner === undefined) {
			return super.UnitPropertyChanged(changed)
		}
		owner.ModifierManager.IsIllusion_ = state
		owner.ModifierManager.CanUseAllItems_ = false
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return super.UnitPropertyChanged(changed)
	}

	protected GetIncomingDamagePercentage(_params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || !owner.IsIllusion) {
			return [0, false]
		}
		return [this.cachedIncomingDamage, false]
	}

	protected UpdateSpecialValues() {
		this.cachedIncomingDamage = this.GetSpecialValue(
			"incoming_damage",
			"chaos_knight_phantasm"
		)
	}
}
