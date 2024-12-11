import { MoveSpeedData } from "../../../../Data/GameData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_centaur_horsepower extends Modifier {
	private static readonly modifiers = [
		"modifier_centaur_stampede",
		"modifier_rune_haste"
	]

	private maxLimit = 0
	private strengthSpeed = 0
	private cachedMinSpeed = 0
	private cachedBonusUnique = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE,
			this.GetMoveSpeedBonusUnique.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT,
			this.GetMoveSpeedIgnoreLimit.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedMinSpeed = 0
			this.cachedMinSpeed = MoveSpeedData.Min
			return
		}

		this.cachedMinSpeed = owner.HasAnyBuffByNames(
			modifier_centaur_horsepower.modifiers
		)
			? this.maxLimit
			: MoveSpeedData.Min

		this.cachedBonusUnique = (owner.TotalStrength * this.strengthSpeed) / 100
	}

	protected GetMoveSpeedIgnoreLimit(): [number, boolean] {
		return [this.maxLimit, false]
	}

	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [this.cachedMinSpeed, false]
	}

	protected GetMoveSpeedBonusUnique(): [number, boolean] {
		return [this.cachedBonusUnique, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "centaur_horsepower"
		this.maxLimit = this.GetSpecialValue("move_speed_limit", name)
		this.strengthSpeed = this.GetSpecialValue("strength_to_movement_pct", name)
	}
}
