import { GetItemTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_smoke_of_deceit extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public get ForceVisible(): boolean {
		return true
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public GetTexturePath(): string {
		const base = super.GetTexturePath()
		const itemName = this.CachedAbilityName
		return itemName !== undefined && itemName !== "" && base !== ""
			? base
			: GetItemTexture("item_smoke_of_deceit")
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue(
			"bonus_movement_speed",
			"item_smoke_of_deceit"
		)
	}
}
