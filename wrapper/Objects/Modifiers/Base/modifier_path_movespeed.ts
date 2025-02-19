import { GetSpellTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier() // river bonus
export class modifier_path_movespeed extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.NetworkFadeTime !== 0
	}
	public GetTexturePath(): string {
		return GetSpellTexture("morphling_adaptive_strike_str")
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.NetworkFadeTime, false]
	}
}
