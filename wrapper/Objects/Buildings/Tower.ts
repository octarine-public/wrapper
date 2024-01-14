import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { GUIInfo } from "../../GUI/GUIInfo"
import { EntityManager } from "../../Managers/EntityManager"
import { Building } from "../Base/Building"
import { Unit } from "../Base/Unit"

@WrapperClass("CDOTA_BaseNPC_Tower")
export class Tower extends Building {
	/** @ignore */
	@NetworkedBasicField("m_hTowerAttackTarget")
	public TowerAttackTarget_ = 0

	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsTower = true
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
