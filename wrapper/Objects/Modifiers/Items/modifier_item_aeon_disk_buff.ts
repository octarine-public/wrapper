import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_aeon_disk_buff extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE,
			this.GetNoDamagePure.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_MAGICAL,
			this.GetNoDamageMagical.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL,
			this.GetNoDamagePhysical.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])

	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetNoDamagePure(): [number, boolean] {
		return [1, false]
	}
	protected GetNoDamageMagical(): [number, boolean] {
		return [1, false]
	}
	protected GetNoDamagePhysical(): [number, boolean] {
		return [1, false]
	}
	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedStatusResist, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedStatusResist = this.GetSpecialValue(
			"status_resistance",
			"item_aeon_disk"
		)
	}
}
