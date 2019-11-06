import Entity from "./Entity"

export default class TempTree extends Entity {
	public readonly m_pBaseEntity: C_DOTA_TempTree

	get ExpireTime(): number {
		return this.m_pBaseEntity.m_fExpireTime
	}
	get CircleCenter(): boolean {
		return this.m_pBaseEntity.m_vecTreeCircleCenter
	}
}
