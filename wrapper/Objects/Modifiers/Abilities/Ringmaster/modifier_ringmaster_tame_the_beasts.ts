import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ringmaster_tame_the_beasts
	extends Modifier
	implements IChannel, IShield
{
	public readonly IsHidden = false
	public readonly ShieldModifierName = this.Name
	public readonly ChannelModifierName = this.Name

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
	public IsChannel(): this is IChannel {
		return true
	}
	public IsShield(): this is IShield {
		return this.cachedMres !== 0
	}
	protected GetAbsoluteNoDamagePure(): [number, boolean] {
		return this.IsShield() ? [1, false] : [0, false]
	}
	protected GetMagicalResistanceBonus(params?: IModifierParams): [number, boolean] {
		const ignoreMagicResist = params?.IgnoreMagicResist ?? false
		return !ignoreMagicResist ? [this.cachedMres, false] : [0, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue(
			"magic_resist",
			"ringmaster_tame_the_beasts"
		)
	}
}
