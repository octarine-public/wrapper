import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ember_spirit_flame_guard
	extends Modifier
	implements IShield, IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedAbsorbShield = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])
	public get StackCount(): number {
		return this.NetworkArmor || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetTotalConstantBlock(params?: IModifierParams): [number, boolean] {
		if (params === undefined || params.Damage === undefined) {
			return [0, false]
		}
		const damage = params.Damage,
			damageBlock = this.NetworkArmor
		if (damageBlock <= damage) {
			return [this.NetworkArmor, false]
		}
		const absDamage = damage * (1 - this.cachedAbsorbShield / 100)
		return [damage - absDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.HasVisualShield = this.NetworkArmor !== 0
		this.cachedAbsorbShield = this.GetSpecialValue(
			"shield_pct_absorb",
			"ember_spirit_flame_guard"
		)
	}
}
