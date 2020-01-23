import { menu_ability, menu_items, array_void_radiuses_menu } from "./Data"
import { XAIOMenuHero, XAIOSelectLanguage, XAIOMenuHeroesTree } from "XAIO/Menu/Menu"
import { Color } from "wrapper/Imports"
import { XIAOlinkenItemsMenu } from "XAIO/Core/Game/Data"

export const {
	XAIOState,
	XAIOBaseTree,
	XAIONearMouse,
	XAIOComboTree,
	XAIOComboKey,
	XAIOStateGlobal,
	XAIOStyleCombo,
	XAIORenderOptimizeType,
	XIAODrawingtargetState,
	XIAORadiusColorAttackRange,
	XAIOAttackRangeRadiusState,
	XAIOAttackRadiusesStyle,
	XAIORenderBindKey,
	XAIORadiusesTree,
	XAIORenderBindKeyStyle,
	XAIORangeRadiusesStyle,
	XIAODrawingtargetLineActive,
	XAIOLinkenBreakTree,
	XAIOOrbWalkerState,
	XAIOSettingsBladMailState,
	XAIOOrbWalkerSwitchState,
	XIAODrawingtargetLineDeactive,
} = XAIOMenuHero(XAIOMenuHeroesTree, "Void Spirit")

export const AbilityMenu = XAIOComboTree.AddImageSelector(
	XAIOSelectLanguage("Cпособности", "Ability"),
	menu_ability,
	new Map(menu_ability.map(name => [name, true]))
)

export const ItemsMenu = XAIOComboTree.AddImageSelector(
	XAIOSelectLanguage("Предметы", "Items"),
	menu_items,
	new Map(menu_items.map(name => [name, true]))
)

/**
 * @____________MenuLinkenBreak____________
*/

export const LinkenBreakAbilityItems = XAIOLinkenBreakTree.AddImageSelector(
	XAIOSelectLanguage("Cпособности & Предметы", "Ability & Items"), XIAOlinkenItemsMenu,
	new Map(XIAOlinkenItemsMenu.map(name => [name, true]))
)

/**
 * @________________MENU_VISUAL__________________
 */

export const VoidSpiritRangeRadiusesSelector = XAIORadiusesTree.AddImageSelector(
	XAIOSelectLanguage("Радиусы", "Radiuses"), array_void_radiuses_menu,
	new Map(array_void_radiuses_menu.map(name => [name, true]))
)

export const BlinkRadiusItemColor = XAIORadiusesTree.AddColorPicker("Blink", Color.RoyalBlue)
export const AetherRemnantRadiusColor = XAIORadiusesTree.AddColorPicker("Aether Remnant", Color.RoyalBlue)
export const AstralStepRadiusColor = XAIORadiusesTree.AddColorPicker("Astral Step", Color.RoyalBlue)
export const DissimilateRadiusColor = XAIORadiusesTree.AddColorPicker("Dissimilate", Color.RoyalBlue)
export const ResonantPulseRadiusColor = XAIORadiusesTree.AddColorPicker("Resonant Pulse", Color.RoyalBlue)
