import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_ringmaster_weighted_pie_blind extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private visionRadius = 0
	private cachedDayVision = 0
	private cachedNightVision = 0

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

	public IsDebuff(): this is IDebuff {
		return true
	}
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
	protected UpdateSpecialValues(): void {
		this.visionRadius = this.GetSpecialValue(
			"vision_radius",
			"ringmaster_weighted_pie"
		)
	}
	private calculateVision(owner: Unit, isNight: boolean = false): number {
		const baseVision = isNight
			? owner.NetworkedBaseNightVision
			: owner.NetworkedBaseDayVision
		const vision = owner.GetTimeVisionModifier(baseVision, isNight, true)
		return Math.remapRange(
			this.ElapsedTime,
			1,
			this.Duration,
			this.visionRadius,
			vision
		)
	}
}
