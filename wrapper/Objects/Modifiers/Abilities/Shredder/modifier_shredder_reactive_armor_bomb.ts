import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shredder_reactive_armor_bomb
	extends Modifier
	implements IBuff, IShield
{
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedShield = 0
	private cachedBaseExplosion = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])
	public get StackCount(): number {
		return this.CurrentShieldDamage || super.StackCount
	}
	public get CurrentShieldDamage(): number {
		return this.cachedBaseExplosion + this.currentShield
	}
	private get currentShield(): number {
		return this.cachedShield - this.NetworkArmor
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return this.currentShield !== 0
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
