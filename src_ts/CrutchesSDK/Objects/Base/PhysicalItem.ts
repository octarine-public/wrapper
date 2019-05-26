import Entity from "./Entity";
import Item from "./Item";
import EntityManager from "../../Managers/EntityManager";
import Debug from "../../Utils/Debug";

export default class PhysicalItem extends Entity {
	
	m_pBaseEntity: C_DOTA_Item_Physical
	
	constructor(ent?: C_BaseEntity, id?: number) {
		super(ent, id);
	}
	
	get Item(): Item {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hItem) as Item;
	}
	get OldItem(): Item {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hOldItem) as Item;
	}
	get ShowingTooltip(): boolean {
		return this.m_pBaseEntity.m_bShowingTooltip;
	}
	
	toString(): string {
		let item = this.Item;
		if (item !== undefined)
			return item.Name;
			
		let oldItem = this.OldItem;
		if (oldItem !== undefined)
			return oldItem.Name;
		
		return this.Name;
	}
}