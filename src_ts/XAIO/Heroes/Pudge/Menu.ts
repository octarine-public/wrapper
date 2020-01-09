import { XMenu, Menu } from "../../Menu/Base"
import { menu_ability, menu_items } from "./Data"

export const {
	State,
	BaseTree,
	NearMouse,
	ComboTree,
	ComboKey,
	SettingsMenu
} = XMenu(Menu, "Pudge")

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

export const HookDelay = SettingsMenu.AddSliderFloat("Hook delay", 100, 0, 500)