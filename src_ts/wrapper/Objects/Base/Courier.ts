import EntityManager from "../../Managers/EntityManager"
import Hero from "./Hero"
import Unit from "./Unit"

export default class Courier extends Unit {
	public NativeEntity: Nullable<C_DOTA_Unit_Courier>
	public IsFlying = false
	public RespawnTime = 0
	public State = CourierState_t.COURIER_STATE_INIT
	public StateHero_ = 0

	get StateHero(): Nullable<Hero> {
		return EntityManager.EntityByIndex(this.StateHero_) as Nullable<Hero>
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Courier", Courier)
RegisterFieldHandler(Courier, "m_bFlyingCourier", (cour, new_value) => cour.IsFlying = new_value as boolean)
RegisterFieldHandler(Courier, "m_flRespawnTime", (cour, new_value) => cour.RespawnTime = new_value as number)
RegisterFieldHandler(Courier, "m_nCourierState", (cour, new_value) => cour.State = new_value as CourierState_t)
RegisterFieldHandler(Courier, "m_hCourierStateEntity", (cour, new_value) => cour.StateHero_ = new_value as number)
