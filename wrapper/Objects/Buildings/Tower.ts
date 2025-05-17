import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { ScaleHeight } from "../../GUI/Helpers"
import { EntityManager } from "../../Managers/EntityManager"
import { Building } from "../Base/Building"
import { Unit } from "../Base/Unit"
import { RegisterFieldHandler } from "../NativeToSDK"

@WrapperClass("CDOTA_BaseNPC_Tower")
export class Tower extends Building {
	public TowerAttackTarget_: number = EntityManager.INVALID_HANDLE

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
		return new Vector2(ScaleHeight(108), ScaleHeight(6))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, ScaleHeight(63))
	}
}

RegisterFieldHandler(Tower, "m_hTowerAttackTarget", (unit, newVal) => {
	unit.IsAttacking = newVal !== EntityManager.INVALID_HANDLE
	unit.TowerAttackTarget_ = newVal as number
})
