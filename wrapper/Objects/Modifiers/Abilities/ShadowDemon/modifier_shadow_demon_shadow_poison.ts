import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shadow_demon_shadow_poison extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedStackDamage = 0
	private cachedMaxMulStacks = 0
	private cachedBonusStackDamage = 0

	public get RawBonusDamage(): number {
		const mulStacks = Math.min(this.StackCount, this.cachedMaxMulStacks),
			overflowStacks = Math.max(this.StackCount - this.cachedMaxMulStacks, 0)
		let damage = Math.pow(2, mulStacks - 1) * this.cachedStackDamage
		if (overflowStacks !== 0) {
			damage += this.cachedBonusStackDamage * overflowStacks
		}
		return damage
	}
	public IsDebuff(): this is IDebuff {
		return this.StackCount !== 0
	}
	protected UpdateSpecialValues(): void {
		const name = "shadow_demon_shadow_poison"
		this.cachedStackDamage = this.GetSpecialValue("stack_damage", name)
		this.cachedMaxMulStacks = this.GetSpecialValue("max_multiply_stacks", name)
		this.cachedBonusStackDamage = this.GetSpecialValue("bonus_stack_damage", name)
	}
}
