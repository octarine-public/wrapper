import EntityManager from "../../Managers/EntityManager"
import Entity from "./Entity"
import Item from "./Item"

export default class PhysicalItem extends Entity {
	public readonly m_pBaseEntity: C_DOTA_Item_Physical

	get Item(): Item {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hItem, true) as Item
	}
	get OldItem(): Item {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hOldItem, true) as Item
	}
	get ShowingTooltip(): boolean {
		return this.m_pBaseEntity.m_bShowingTooltip
	}

	public toString(): string {
		let item = this.Item
		if (item !== undefined)
			return item.Name

		let oldItem = this.OldItem
		if (oldItem !== undefined)
			return oldItem.Name

		return this.Name
	}
}
