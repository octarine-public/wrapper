import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_acid_spray extends Modifier implements IDebuff, IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	private cachedArmor = 0
	private hasAllyArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	public IsDebuff(): this is IDebuff {
		return this.IsEnemy(this.Caster)
	}

	public IsBuff(): this is IBuff {
		return !this.IsDebuff()
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		const value = owner.IsEnemy(caster)
			? -this.cachedArmor
			: this.hasAllyArmor
				? this.cachedArmor
				: 0
		return [value, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "alchemist_acid_spray"
		this.cachedArmor = this.GetSpecialValue("armor_reduction", name)
		this.hasAllyArmor = this.GetSpecialValue("armor_allies", name)
	}
}
