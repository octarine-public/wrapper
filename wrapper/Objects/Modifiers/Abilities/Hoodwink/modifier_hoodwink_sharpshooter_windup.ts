import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hoodwink_sharpshooter_windup extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

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
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected GetDisableTurning(): [number, boolean] {
		return [1, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedMaxDamage = this.GetSpecialValue("max_damage", "hoodwink_sharpshooter")
	}
}
