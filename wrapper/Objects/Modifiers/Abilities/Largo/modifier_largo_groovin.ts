import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_largo_groovin extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedArmor = 0
	private cachedManaCostReduction = 0
	private cachedHasUltimate = false
	protected readonly CanPostDataUpdate: boolean = true

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetBonusPhysicalArmor.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_REDUCTION_CONSTANT,
			this.GetManaCostReductionConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedHasUltimate = false
			return
		}
		this.cachedHasUltimate = owner.HasBuffByName(
			"modifier_largo_amphibian_rhapsody_self"
		)
	}
	public GetBonusPhysicalArmor(): [number, boolean] {
		return [this.cachedArmor * this.StackCount, false]
	}
	public GetManaCostReductionConstant(): [number, boolean] {
		return [this.cachedManaCostReduction * this.StackCount, !this.cachedHasUltimate]
	}
	protected UpdateSpecialValues(): void {
		const name = "largo_groovin"
		this.cachedArmor = this.GetSpecialValue("armor_per_stack", name)
		this.cachedManaCostReduction = this.GetSpecialValue(
			"song_cost_reduction_per_stack_tooltip",
			name
		)
	}
}
