import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { ScaleHeight } from "../../GUI/Helpers"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Unit } from "../Base/Unit"
import { RegisterFieldHandler } from "../NativeToSDK"

@WrapperClass("CDOTA_Unit_SpiritBear")
export class SpiritBear extends Unit {
	/** @readonly */
	public ShouldRespawn = false

	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsSpiritBear = true
	}

	public CanMove(
		checkChanneling: boolean = true,
		checkAbilityPhase: boolean = true
	): boolean {
		return this.ShouldRespawn && super.CanMove(checkChanneling, checkAbilityPhase)
	}
	public CanAttack(
		target?: Unit,
		checkChanneling: boolean = true,
		checkAbilityPhase: boolean = true,
		additionalRange?: number,
		checkAttackRange?: boolean
	): boolean {
		return (
			this.ShouldRespawn &&
			super.CanAttack(
				target,
				checkChanneling,
				checkAbilityPhase,
				additionalRange,
				checkAttackRange
			)
		)
	}
	public get HealthBarSize() {
		return !this.IsEnemy()
			? new Vector2(ScaleHeight(100), ScaleHeight(6))
			: new Vector2(ScaleHeight(100), ScaleHeight(8))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, ScaleHeight(30))
	}
}

RegisterFieldHandler(SpiritBear, "m_bShouldRespawn", (unit, newVal) => {
	const oldValue = unit.ShouldRespawn
	if (oldValue !== newVal) {
		unit.ShouldRespawn = newVal as boolean
		EventsSDK.emit("UnitPropertyChanged", false, unit)
	}
})
