import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shredder_reactive_armor_bomb extends Modifier {
	public readonly HasVisualShield = true

	private cachedShield = 0
	private cachedBaseExplosion = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])

	public get CurrentShieldDamage(): number {
		return this.cachedBaseExplosion + this.currentShield
	}

	private get currentShield(): number {
		return this.cachedShield - this.NetworkArmor
	}

	protected GetTotalConstantBlock(): [number, boolean] {
		return [this.currentShield, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "shredder_reactive_armor"
		this.cachedShield = this.GetSpecialValue("max_shield", name)
		this.cachedBaseExplosion = this.GetSpecialValue("base_explosion", name)
	}
}
