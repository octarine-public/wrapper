import { AbilityImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_legion_commander_press_the_attack_immunity
	extends Modifier
	implements IBuff, IShield
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE,
			this.GetAbsoluteNoDamagePure.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])
	public GetTexturePath(): string {
		return AbilityImagePath + "/modifier_magicimmune_png.vtex_c"
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetAbsoluteNoDamagePure(): [number, boolean] {
		return [1, false]
	}
	protected GetMagicalResistanceBonus(params?: IModifierParams): [number, boolean] {
		const ignoreMagicResist = params?.IgnoreMagicResist ?? false
		return !ignoreMagicResist ? [this.cachedMres, false] : [0, false]
	}
	protected UpdateSpecialValues() {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const abil = owner.GetAbilityByName("special_bonus_unique_legion_commander_8")
		this.cachedMres = abil?.GetSpecialValue("value") ?? 0
	}
}
