import EntityManager from "../../Managers/EntityManager";
import Unit from "./Unit"
import Hero from "./Hero";

export default class Courier extends Unit {
	
	readonly m_pBaseEntity: C_DOTA_Unit_Courier
	
	get IsFlying(): boolean {
		return this.m_pBaseEntity.m_bFlyingCourier;	
	}
	get RespawnTime(): number {
		return this.m_pBaseEntity.m_flRespawnTime;
	}
	get State(): CourierState_t {
		return this.m_pBaseEntity.m_nCourierState;
	}
	get StateHero(): Hero {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hCourierStateEntity) as Hero;
	}
}