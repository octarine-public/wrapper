import Item from "../../Base/Item"

export default class item_aeon_disk extends Item {
	static ModifierName: string = "modifier_item_aeon_disk_buff"

	readonly m_pBaseEntity: C_DOTA_Item_AeonDisk
}