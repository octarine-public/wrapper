import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tidehunter_leviathans_catch_stacks
	extends Modifier
	implements IBuff
{
	public readonly IsHidden: boolean = false
	public readonly BuffModifierName: string = this.Name

	private cachedAttackRange = 0
	private cachedDamageBlock = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK,
			this.GetPhysicalConstantBlock.bind(this)
		]
	])
	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedAttackRange * this.StackCount, false]
	}
	protected GetPhysicalConstantBlock(): [number, boolean] {
		return [this.cachedDamageBlock * this.StackCount, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "tidehunter_leviathans_catch"
		this.cachedAttackRange = this.GetSpecialValue("fish_attack_range", name)
		this.cachedDamageBlock = this.GetSpecialValue("fish_damage_block", name)
	}
}
