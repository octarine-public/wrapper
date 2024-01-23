import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { CourierState } from "../../Enums/CourierState"
import { GUIInfo } from "../../GUI/GUIInfo"
import { EntityManager } from "../../Managers/EntityManager"
import { Hero } from "./Hero"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_Unit_Courier")
export class Courier extends Unit {
	@NetworkedBasicField("m_bFlyingCourier")
	public IsFlying = false
	@NetworkedBasicField("m_flRespawnTime")
	public RespawnTime = 0
	@NetworkedBasicField("m_nCourierState")
	public State = CourierState.COURIER_STATE_INIT
	@NetworkedBasicField("m_hCourierStateEntity")
	public StateHero_ = 0

	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsCourier = true
	}

	public get StateHero() {
		return EntityManager.EntityByIndex<Hero>(this.StateHero_)
	}
	public get ShouldUnifyOrders(): boolean {
		return false
	}

	public get HealthBarSize() {
		return new Vector2(GUIInfo.ScaleHeight(30), GUIInfo.ScaleHeight(6))
	}

	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, this.HealthBarSize.y)
	}
}
export const Coruiers = EntityManager.GetEntitiesByClass(Courier)
