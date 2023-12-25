import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_bullwhip_buff extends Modifier {
	public readonly IsBuff = true
	public readonly IsDebuff = true

	protected SetAmplifierMoveSpeed(specialName = "speed"): void {
		if (this.Caster === undefined || this.Parent === undefined) {
			return
		}
		const special = this.GetSpecialValue(specialName)
		this.BonusMoveSpeedAmplifier =
			this.Caster.Team === this.Parent?.Team
				? special / 100
				: !this.Parent.IsUnslowable
					? -special / 100
					: 0
	}
}
