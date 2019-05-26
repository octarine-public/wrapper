import Item from "../../Base/Item";

export default class item_bottle extends Item {

	m_pBaseEntity: C_DOTA_Item_EmptyBottle

	get StoredRune(): DOTA_RUNES {
		return this.m_pBaseEntity.m_iStoredRuneType;
	}
	get StoredRuneTime(): number {
		return this.m_pBaseEntity.m_fStoredRuneTime
	}
}