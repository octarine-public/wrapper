import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_skywrath_mage_shield_barrier
	extends Modifier
	implements IShield, IBuff
{
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedBaseShield = 0
	private cachedShieldPerLvl = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK,
			this.GetMagicalConstantBlock.bind(this)
		]
	])
	public get StackCount(): number {
		return this.CurrentShield || super.StackCount
	}
	private get CurrentShield(): number {
		const owner = this.Parent
		if (owner === undefined) {
			return 0
		}
		const perLvl = this.cachedShieldPerLvl * owner.Level,
			value = (this.cachedBaseShield + perLvl) * this.InternalStackCount
		return value - this.NetworkArmor
	}
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	public IsShield(): this is IShield {
		return this.CurrentShield !== 0
	}
	protected GetMagicalConstantBlock(_params?: IModifierParams): [number, boolean] {
		return [this.CurrentShield, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "skywrath_mage_shield_of_the_scion"
		this.cachedBaseShield = this.GetSpecialValue("damage_barrier_base", name)
		this.cachedShieldPerLvl = this.GetSpecialValue("damage_barrier_per_level", name)
	}
}
