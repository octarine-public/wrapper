import Item from "../../Base/Item"

export default class item_power_treads extends Item {
	public readonly m_pBaseEntity: C_DOTA_Item_PowerTreads

	public get ActiveAttribute(): Attributes {
		return this.m_pBaseEntity.m_iStat
	}
}
