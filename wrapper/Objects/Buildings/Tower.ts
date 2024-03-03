import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { GUIInfo } from "../../GUI/GUIInfo"
import { EntityManager } from "../../Managers/EntityManager"
import { Building } from "../Base/Building"
import { Unit } from "../Base/Unit"
import { RegisterFieldHandler } from "../NativeToSDK"

@WrapperClass("CDOTA_BaseNPC_Tower")
export class Tower extends Building {
	/**
	 * @ignore
	 * @internal
	 */
	public TowerAttackTarget_: number = 16777215 // default by networked field
	/**
	 * @ignore
	 * @internal
	 */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsTower = true
	}

	public get Target() {
		return this.TowerAttackTarget
	}

	public get TowerAttackTarget() {
		return EntityManager.EntityByIndex<Unit>(this.TowerAttackTarget_)
	}

	public get IsDeniable(): boolean {
		return super.IsDeniable || this.HPPercent <= 10
	}

	public get HealthBarSize() {
		return new Vector2(GUIInfo.ScaleHeight(108), GUIInfo.ScaleHeight(6))
	}

	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, GUIInfo.ScaleHeight(63))
	}
}

RegisterFieldHandler(Tower, "m_hTowerAttackTarget", (unit, newVal) => {
	unit.IsAttacking = newVal !== 16777215
	unit.TowerAttackTarget_ = newVal as number
})
