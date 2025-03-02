import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_manta extends Modifier {
	private cachedIncomingDamage = 0
	private cachedOutgoingDamageMelee = 0
	private cachedOutgoingDamageRanged = 0

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

	protected GetOutgoingDamagePercentageIllusion(
		_params?: IModifierParams
	): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || !owner.IsIllusion) {
			return [0, false]
		}
		return this.HasMeleeAttacksBonuses()
			? [this.cachedOutgoingDamageMelee, false]
			: [this.cachedOutgoingDamageRanged, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_manta"
		this.cachedIncomingDamage = this.GetSpecialValue(
			"images_take_damage_percent",
			name
		)
		this.cachedOutgoingDamageMelee = this.GetSpecialValue(
			"images_do_damage_percent_melee",
			name
		)
		this.cachedOutgoingDamageRanged = this.GetSpecialValue(
			"images_do_damage_percent_ranged",
			name
		)
	}
}
