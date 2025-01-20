import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_void_spirit_resonant_pulse_physical_buff
	extends Modifier
	implements IBuff, IShield
{
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private isAllBarrier = false

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK_SPECIAL,
			this.GetPhysicalConstantBlockSpecial.bind(this)
		]
	])
	public get StackCount(): number {
		return this.NetworkArmor || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	public IsShield(): this is IShield {
		return this.StackCount !== 0
	}
	protected GetTotalConstantBlock(): [number, boolean] {
		return this.isAllBarrier ? [this.NetworkArmor, false] : [0, false]
	}
	protected GetPhysicalConstantBlockSpecial(): [number, boolean] {
		return this.isAllBarrier ? [0, false] : [this.NetworkArmor, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "void_spirit_resonant_pulse"
		this.isAllBarrier = this.GetSpecialValue("is_all_barrier", name) !== 0
	}
}
