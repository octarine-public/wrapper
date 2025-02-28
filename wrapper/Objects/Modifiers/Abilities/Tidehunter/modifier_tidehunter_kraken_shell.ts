import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tidehunter_kraken_shell extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private totalDamageBlock = 0
	private cachedBlockDamage = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK,
			this.GetPhysicalConstantBlock.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	public PostDataUpdate(): void {
		const owner = this.Parent
		let damageBlock = this.cachedBlockDamage + this.StackCount
		if (owner === undefined) {
			this.totalDamageBlock = damageBlock
			return
		}
		if (owner.HasBuffByName("modifier_tidehunter_kraken_shell_boost")) {
			damageBlock *= 2
		}
		this.totalDamageBlock = damageBlock
	}
	protected GetPhysicalConstantBlock(): [number, boolean] {
		return [this.totalDamageBlock, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedBlockDamage = this.GetSpecialValue(
			"damage_reduction",
			"tidehunter_kraken_shell"
		)
	}
}
