import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_raptor_dance_immune
	extends Modifier
	implements IBuff, IShield, IChannel
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
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
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	public IsChannel(): this is IChannel {
		return true
	}
	protected GetAbsoluteNoDamagePure(): [number, boolean] {
		return [1, false]
	}
	protected GetMagicalResistanceBonus(params?: IModifierParams): [number, boolean] {
		const ignoreMagicResist = params?.IgnoreMagicResist ?? false
		return !ignoreMagicResist ? [this.cachedMres, false] : [0, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue("magic_resist", "kez_raptor_dance")
	}
}
