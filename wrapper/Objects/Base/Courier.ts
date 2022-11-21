import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { CourierState } from "../../Enums/CourierState"
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

	public get StateHero(): Nullable<Hero> {
		return EntityManager.EntityByIndex(this.StateHero_) as Nullable<Hero>
	}
	public get ShouldUnifyOrders(): boolean {
		return false
	}
}
export const Coruiers = EntityManager.GetEntitiesByClass(Courier)
