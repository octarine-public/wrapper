import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hoodwink_sharpshooter_windup extends Modifier {
	private cachedMaxDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DISABLE_TURNING,
			this.GetDisableTurning.bind(this)
		]
	])

	public get RemainingDamage() {
		return (this.cachedMaxDamage * this.StackCount) / 100
	}

	protected GetDisableTurning(): [number, boolean] {
		return [1, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedMaxDamage = this.GetSpecialValue("max_damage", "hoodwink_sharpshooter")
	}
}
