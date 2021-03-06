import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { CourierState_t } from "../../Enums/CourierState_t"
import EntityManager from "../../Managers/EntityManager"
import Hero from "./Hero"
import Unit from "./Unit"

@WrapperClass("CDOTA_Unit_Courier")
export default class Courier extends Unit {
	@NetworkedBasicField("m_bFlyingCourier")
	public IsFlying = false
	@NetworkedBasicField("m_flRespawnTime")
	public RespawnTime = 0
	@NetworkedBasicField("m_nCourierState")
	public State = CourierState_t.COURIER_STATE_INIT
	@NetworkedBasicField("m_hCourierStateEntity")
	public StateHero_ = 0

	public get StateHero(): Nullable<Hero> {
		return EntityManager.EntityByIndex(this.StateHero_) as Nullable<Hero>
	}
}
