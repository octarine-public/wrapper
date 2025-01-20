import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_crimson_guard_extra
	extends Modifier
	implements IShield, IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedBlockDamage = 0
	private cachedMaxHPBlock = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK,
			this.GetPhysicalConstantBlock.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetPhysicalConstantBlock(): [number, boolean] {
		const maxHP = this.Caster?.MaxHP ?? 0
		return [this.cachedBlockDamage + (maxHP * this.cachedMaxHPBlock) / 100, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_crimson_guard"
		this.cachedMaxHPBlock = this.GetSpecialValue("max_hp_pct", name)
		this.cachedBlockDamage = this.GetSpecialValue("block_damage_active", name)
	}
}
