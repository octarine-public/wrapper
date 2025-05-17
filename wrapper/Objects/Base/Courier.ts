import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { CourierState } from "../../Enums/CourierState"
import { ScaleHeight } from "../../GUI/Helpers"
import { EntityManager } from "../../Managers/EntityManager"
import { Hero } from "./Hero"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_Unit_Courier")
export class Courier extends Unit {
	@NetworkedBasicField("m_bFlyingCourier")
	public readonly IsFlying: boolean = false
	@NetworkedBasicField("m_flRespawnTime")
	public readonly RespawnTime: number = 0
	@NetworkedBasicField("m_nCourierState")
	public readonly State: CourierState = CourierState.COURIER_STATE_INIT
	@NetworkedBasicField("m_hCourierStateEntity")
	public readonly StateHero_: number = EntityManager.INVALID_HANDLE

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
		return new Vector2(ScaleHeight(30), ScaleHeight(6))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, this.HealthBarSize.y)
	}
}
export const Coruiers = EntityManager.GetEntitiesByClass(Courier)
