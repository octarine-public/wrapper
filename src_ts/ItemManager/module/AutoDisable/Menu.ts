import { GetItemsBy } from "./Helper"
import { Menu, MenuBase } from "../../abstract/MenuBase"
import { Disable_Items, Disabler_Abilities, Disable_Important } from "./Data"
export const { BaseTree, State } = MenuBase(Menu, "Auto Disable")

export const AngryDisablerState = BaseTree.AddToggle("Angry Disabler")
export const AntiChannelingState = BaseTree.AddToggle("Anti Channeling")

const ItemsOfDisableTree = BaseTree.AddNode("Items of Disable")
export const ItemsOfDisableState = ItemsOfDisableTree.AddToggle("Enable")
export const ItemsOfDisable = ItemsOfDisableTree.AddImageSelector("Select", GetItemsBy(Disable_Items, "abil"),
	new Map(GetItemsBy(Disable_Items, "abil").map(name => [name, true])))

const AbilityOfDisableTree = BaseTree.AddNode("Ability of Disable")
export const AbilityOfDisable = AbilityOfDisableTree.AddImageSelector("Select", Disabler_Abilities,
	new Map(Disabler_Abilities.map(name => [name, true])))

const ScrollDisableTree = BaseTree.AddNode("Disable enemy with TP")
export const ScrollDisableItemsState = ScrollDisableTree.AddToggle("Enable", true)
export const ScrollDisableItems = ScrollDisableTree.AddImageSelector("Select", GetItemsBy(Disable_Items, "tp"),
	new Map(GetItemsBy(Disable_Items, "tp").map(name => [name, true])))

const ImportantTree = BaseTree.AddNode("Important Abilities")
export const ImportantAbility = ImportantTree.AddImageSelector("Select", Disable_Important,
	new Map(Disable_Important.map(name => [name, true])))
