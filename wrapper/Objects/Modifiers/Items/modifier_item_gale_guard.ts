import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_gale_guard extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedShield = 0
	private cachedShieldPct = 0
	private cachedSlowResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])

	public get StackCount() {
		return this.cachedShield - this.NetworkDamage || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSlowResist, false]
	}
	protected GetTotalConstantBlock(params?: IModifierParams): [number, boolean] {
		if (params === undefined || params.Damage === undefined) {
			return [0, false]
		}
		const damage = params.Damage,
			damageBlock = damage * (1 - this.cachedShieldPct / 100)
		if (this.StackCount + damageBlock <= damage) {
			return [this.StackCount, false]
		}
		return [damage - damageBlock, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_gale_guard"
		this.cachedShield = this.GetSpecialValue("barrier_amount", name)
		this.cachedSlowResist = this.GetSpecialValue("slow_resist", name)
		this.cachedShieldPct = this.GetSpecialValue("barrier_pct", name)
	}
}
