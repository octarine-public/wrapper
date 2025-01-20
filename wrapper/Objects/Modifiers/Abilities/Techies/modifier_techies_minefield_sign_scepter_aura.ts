import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_techies_minefield_sign_scepter_aura
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDuration = 0

	public get Duration() {
		return this.cachedDuration || super.Duration
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected UpdateSpecialValues(): void {
		this.cachedDuration = this.GetSpecialValue(
			"minefield_duration",
			"techies_minefield_sign"
		)
	}
}
