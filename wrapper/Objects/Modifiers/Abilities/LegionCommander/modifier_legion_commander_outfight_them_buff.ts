import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_legion_commander_outfight_them_buff
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	private cachedArmor = 0
	private cachedAllyFactor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return this.Caster === this.Parent
			? [this.cachedArmor, false]
			: [(this.cachedArmor * this.cachedAllyFactor) / 100, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "legion_commander_outfight_them"
		this.cachedAllyFactor = this.GetSpecialValue("ally_factor", name)
		this.cachedArmor = this.GetSpecialValue(
			"armor",
			name,
			Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
		)
	}
}
