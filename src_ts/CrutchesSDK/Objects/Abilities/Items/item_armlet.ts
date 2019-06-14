import Item from "../../Base/Item";

export default class item_armlet extends Item {
	static ModifierName: string = "modifier_item_armlet_unholy_strength";
	
	readonly m_pBaseEntity: C_DOTA_Item_Armlet;
	
	get ToggleCooldown(): number {
		return this.m_pBaseEntity.toggle_cooldown;
	}
}