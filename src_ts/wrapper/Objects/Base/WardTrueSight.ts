import WardObserver from "./WardObserver";
export default class WardTrueSight extends WardObserver {
	public readonly m_pBaseEntity: CDOTA_NPC_Observer_Ward_TrueSight;
	public get TrueSight(): number {
		return this.m_pBaseEntity.m_iTrueSight;
	}
	// TODO
	public get Caster(): CEntityIndex {
		return this.m_pBaseEntity.m_hCasterEntity;
	}
	// TODO
	public get Ability(): CEntityIndex {
		return this.m_pBaseEntity.m_hAbilityEntity;
	}
}