import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Hero } from "../../../Base/Hero"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_furion_spirit_of_the_forest extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMultiplier: number = 0
	private cachedDamagePerTree: number = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public get StackCount(): number {
		const owner = this.Parent
		if (owner === undefined) {
			return super.StackCount
		}
		const params = {
			RawDamageBase: owner.AttackDamageAverage
		}
		return this.getDamage(params) >> 0 || super.StackCount
	}
	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		return [this.getDamage(params), false]
	}
	protected UpdateSpecialValues(): void {
		const name = "furion_spirit_of_the_forest"
		this.cachedMultiplier = this.GetSpecialValue("multiplier", name)
		this.cachedDamagePerTree = this.GetSpecialValue("damage_per_tree_pct", name)
	}
	private getDamage(params?: IModifierParams) {
		if (params === undefined) {
			return 0
		}
		const owner = this.Parent
		if (!(owner instanceof Hero) || this.IsPassiveDisabled()) {
			return 0
		}
		let multiplier = this.cachedMultiplier
		if (owner.HeroFacetID === 1) {
			multiplier = this.cachedDamagePerTree
		}
		const mulDamage = this.NetworkDamage * multiplier
		return ((params.RawDamageBase ?? 0) * mulDamage) / 100
	}
}
