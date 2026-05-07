import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_marci_bodyguarded extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedDamage = 0
	private cachedBlockAmount = 0
	private cachedPenaltyDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public get StackCount(): number {
		return this.GetTotalConstantBlock()[0] >> 0 || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	public GetTotalConstantBlock(): [number, boolean] {
		return [Math.max(this.cachedBlockAmount - this.NetworkDamage, 0), false]
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined) {
			return [0, false]
		}
		if (owner === this.Caster) {
			return [0, false]
		}
		const damage = (this.cachedDamage * (params.RawDamageBase ?? 0)) / 100
		return [(damage * this.cachedPenaltyDamage) / 100, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "marci_bodyguard"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedBlockAmount = this.GetSpecialValue("shared_barrier", name)
		this.cachedPenaltyDamage = this.GetSpecialValue("max_partner_penalty", name)
	}
}
