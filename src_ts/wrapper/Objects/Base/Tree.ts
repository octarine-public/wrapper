import Entity from "./Entity";

export default class Tree extends Entity {
	readonly m_pBaseEntity: C_DOTA_MapTree

	get IsAlive(): boolean {
		return this.m_pBaseEntity.m_bActive;
	}
	get BinaryID(): number {
		return this.m_pBaseEntity.m_nBinaryID;
	}
}
