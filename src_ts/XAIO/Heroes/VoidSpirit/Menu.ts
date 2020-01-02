import { XMenu, Menu } from "../../Menu/Base"
import { menu_ability, menu_items } from "./Data"

export const {
	State,
	BaseTree,
	NearMouse,
	ComboTree,
	ComboKey,
} = XMenu(Menu, "Void Spirit")

export const AbilityMenu = ComboTree.AddImageSelector(
	"Ability",
	menu_ability,
	new Map(menu_ability.map(name => [name, true]))
)

export const ItemsMenu = ComboTree.AddImageSelector(
	"Items",
	menu_items,
	new Map(menu_items.map(name => [name, true]))
)
