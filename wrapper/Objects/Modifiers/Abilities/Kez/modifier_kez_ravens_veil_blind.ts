import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_kez_ravens_veil_blind extends Modifier {
	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_FIXED_DAY_VISION,
			this.GetFixedDayVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_FIXED_NIGHT_VISION,
			this.GetFixedNightVision.bind(this)
		]
	])

	private cachedDayVision = 0
	private cachedNightVision = 0

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedDayVision = 0
			this.cachedNightVision = 0
			return
		}
		this.cachedDayVision = this.calculateVision(owner)
		this.cachedNightVision = this.calculateVision(owner, true)
	}

	protected GetFixedDayVision(): [number, boolean] {
		return [this.cachedDayVision, this.IsMagicImmune()]
	}

	protected GetFixedNightVision(): [number, boolean] {
		return [this.cachedNightVision, this.IsMagicImmune()]
	}

	private calculateVision(owner: Unit, isNight: boolean = false): number {
		const baseVision = isNight ? owner.NetworkedNightVision : owner.NetworkedDayVision
		const vision = owner.GetTimeVisionModifier(baseVision, isNight, true)
		return Math.remapRange(this.ElapsedTime, 1, this.Duration, 50, vision)
	}
}
