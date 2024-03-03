import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { GUIInfo } from "../../GUI/GUIInfo"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Unit } from "../Base/Unit"
import { RegisterFieldHandler } from "../NativeToSDK"

@WrapperClass("CDOTA_Unit_SpiritBear")
export class SpiritBear extends Unit {
	/**
	 * @readonly
	 * @return {boolean}
	 */
	public ShouldRespawn = false

	/** @ignore */
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
		additionalRange?: number
	): boolean {
		return (
			this.ShouldRespawn &&
			super.CanAttack(target, checkChanneling, checkAbilityPhase, additionalRange)
		)
	}
	public get HealthBarSize() {
		return !this.IsEnemy()
			? new Vector2(GUIInfo.ScaleHeight(100), GUIInfo.ScaleHeight(6))
			: new Vector2(GUIInfo.ScaleHeight(100), GUIInfo.ScaleHeight(8))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, GUIInfo.ScaleHeight(30))
	}
}

RegisterFieldHandler(SpiritBear, "m_bShouldRespawn", (unit, newVal) => {
	unit.ShouldRespawn = newVal as boolean
	EventsSDK.emit("UnitPropertyChanged", false, unit)
})
