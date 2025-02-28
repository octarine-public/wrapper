import { MoveSpeedData } from "../../../Data/GameData"
import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_haste extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMaxMoveSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		]
	])
	public get ForceVisible() {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedMaxMoveSpeed = MoveSpeedData.Max
			return
		}
		const speedLimit = owner.ModifierManager.GetConstantLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_LIMIT
		)
		this.cachedMaxMoveSpeed = Math.max(MoveSpeedData.Max, speedLimit)
	}
	public GetTexturePath(small = false) {
		return GetRuneTexture("haste", small)
	}
	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [this.cachedMaxMoveSpeed, false]
	}
}
