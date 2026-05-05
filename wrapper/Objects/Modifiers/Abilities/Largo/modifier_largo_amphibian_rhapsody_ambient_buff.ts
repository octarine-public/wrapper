import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { modifier_largo_groovin } from "./modifier_largo_groovin"

@WrapperClassModifier()
export class modifier_largo_amphibian_rhapsody_ambient_buff
	extends Modifier
	implements IBuff
{
	public readonly IsHidden: boolean = false
	public readonly BuffModifierName: string = this.Name
	private cachedArmor = 0

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
		const owner = this.Caster
		if (owner === undefined) {
			return [0, false]
		}
		const modifier = owner.GetBuffByClass(modifier_largo_groovin)
		if (modifier === undefined) {
			return [0, false]
		}
		const [bonusArmor] = modifier.GetBonusPhysicalArmor()
		return [(bonusArmor * this.cachedArmor) / 100, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue(
			"armor_ally_pct",
			"largo_amphibian_rhapsody"
		)
	}
}
