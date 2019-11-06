import EntityManager from "../../Managers/EntityManager"
import Hero from "./Hero"
import Unit from "./Unit"

export default class Courier extends Unit {
	public readonly m_pBaseEntity: C_DOTA_Unit_Courier

	get IsCourier(): boolean {
		return true
	}
	get IsFlying(): boolean {
		return this.m_pBaseEntity.m_bFlyingCourier
	}
	get RespawnTime(): number {
		return this.m_pBaseEntity.m_flRespawnTime
	}
	get State(): CourierState_t {
		return this.m_pBaseEntity.m_nCourierState
	}
	get StateHero(): Hero {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hCourierStateEntity) as Hero
	}
}
