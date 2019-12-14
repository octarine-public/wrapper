import Item from "../../Base/Item"

export default class item_armlet extends Item {
	public static readonly ModifierName: string = "modifier_item_armlet_unholy_strength"

	public readonly m_pBaseEntity: C_DOTA_Item_Armlet

	public get ToggleCooldown(): number {
		return this.m_pBaseEntity.toggle_cooldown
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_armlet", item_armlet)
