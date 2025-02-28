import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_warcry extends Modifier implements IShield, IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = "modifier_sven_warcry_barrier"

	private cachedSpeed = 0
	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public get StackCount(): number {
		return this.shieldCount || super.StackCount
	}
	private get shieldCount() {
		const owner = this.Parent
		if (owner === undefined) {
			return 0
		}
		const modifier = owner.GetBuffByName("modifier_sven_warcry_barrier")
		if (modifier === undefined) {
			return 0
		}
		return modifier.StackCount
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return this.shieldCount !== 0
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "sven_warcry"
		this.cachedSpeed = this.GetSpecialValue("movespeed", name)
		this.cachedArmor = this.GetSpecialValue("bonus_armor", name)
	}
}
