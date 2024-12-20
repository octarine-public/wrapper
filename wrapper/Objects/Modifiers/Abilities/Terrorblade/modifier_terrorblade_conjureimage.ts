import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_terrorblade_conjureimage extends Modifier {
	private cachedOutDamage = 0
	private cachedIncDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION,
			this.GetOutgoingDamagePercentageIllusion.bind(this)
		]
	])

	private GetOutgoingDamagePercentageIllusion(): [number, boolean] {
		return [this.cachedOutDamage, false]
	}

	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [this.cachedIncDamage, false]
	}

	public UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		const state = (changed ??= true)
		if (owner === undefined) {
			return super.UnitPropertyChanged(changed)
		}
		owner.ModifierManager.IsReflection_ = state
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return super.UnitPropertyChanged(changed)
	}

	protected UpdateSpecialValues(): void {
		const name = "terrorblade_conjure_image"
		this.cachedOutDamage = this.GetSpecialValue("illusion_outgoing_damage", name)
		this.cachedIncDamage = this.GetSpecialValue("illusion_incoming_damage", name)
	}
}
