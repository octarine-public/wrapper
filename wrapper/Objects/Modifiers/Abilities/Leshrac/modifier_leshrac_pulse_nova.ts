import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_leshrac_pulse_nova extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedIncDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public get ForceVisible(): boolean {
		return true
	}
	public IsBuff(): this is IBuff {
		return this.cachedSpeed !== 0 || this.cachedIncDamage !== 0
	}
	protected GetIncomingDamagePercentage(_params?: IModifierParams): [number, boolean] {
		return [-this.cachedIncDamage, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "leshrac_pulse_nova"
		this.cachedSpeed = this.GetSpecialValue("bonus_movespeed", name)
		this.cachedIncDamage = this.GetSpecialValue("damage_resistance", name)
	}
}
