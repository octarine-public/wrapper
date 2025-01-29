import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_doubledamage extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])
	public get ForceVisible() {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public GetTexturePath(small = false) {
		return GetRuneTexture("doubledamage", small)
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [15, false]
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || params.RawDamageBase === undefined) {
			return [0, false]
		}
		return [(params.RawDamageBase * 80) / 100, false]
	}
}
