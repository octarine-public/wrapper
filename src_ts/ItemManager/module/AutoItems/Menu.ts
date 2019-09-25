import { Menu, MenuBase } from "../../abstract/MenuBase"
const { BaseTree, State } = MenuBase(Menu, "Auto Items")
State.SetTooltip("Auto use items")
// loop-optimizer: KEEP
let Items: string[] = [
	"item_phase_boots",
	"item_magic_stick",
	"item_magic_wand",
	"item_hand_of_midas",
	"item_arcane_boots",
	"item_mekansm",
	"item_guardian_greaves",
	"item_bottle",
	"item_urn_of_shadows",
	"item_spirit_vessel",
	"item_bloodstone",
	"item_tango",
	"item_tango_single",
	"item_faerie_fire",
	"item_dust",
	"item_buckler",
	"item_cheese",
	"item_mjollnir",
]

let ItemsForUse = BaseTree.AddImageSelector("Select items for use", Items)

// Settings Items
let SettingsAutoItems = BaseTree.AddNode("Items settings"),
	AutoUseItemsSticks = SettingsAutoItems.AddNode("Stick"),
	AutoUseItemsSticks_val = AutoUseItemsSticks.AddSlider("HP precent (%)", 10, 1, 99)

let AutoUseItemsPhaseBoots = SettingsAutoItems.AddNode("Phase Boots"),
	AutoUseItemsPhaseBootsState = AutoUseItemsPhaseBoots.AddToggle("Check from enemy"),
	AutoUseItemsPhase_val = AutoUseItemsPhaseBoots.AddSlider("Distance", 300, 150, 2000)

let AutoUseItemsFaerieFire = SettingsAutoItems.AddNode("Faerie Fire"),
	AutoUseItemsFaerieFire_val = AutoUseItemsFaerieFire.AddSlider("HP for use", 100, 1, 1000)

let AutoUseItemsCheese = SettingsAutoItems.AddNode("Cheese"),
	AutoUseItemsCheese_val = AutoUseItemsCheese.AddSlider("HP precent (%)", 10, 1, 99)

let AutoUseItemsArcane = SettingsAutoItems.AddNode("Arcane Boots"),
	AutoUseItemsArcane_val = AutoUseItemsArcane.AddSlider("MP precent (%)", 10, 1, 99)

let AutoUseItemsMG = SettingsAutoItems.AddNode("Mekansm / Graves"),
	AutoUseItemsMG_val = AutoUseItemsMG.AddSlider("HP precent (%)", 10, 1, 99)

let AutoUseItemsBlood = SettingsAutoItems.AddNode("Bloodstone"),
	AutoUseItemsBloodHP_val = AutoUseItemsBlood.AddSlider("HP precent (%)", 10, 1, 99),
	AutoUseItemsBloodMP_val = AutoUseItemsBlood.AddSlider("Min mana precent (%)", 7, 1, 100)

let AutoUseItemsMidas = SettingsAutoItems.AddNode("Midas"),
	AutoUseItemsMidas_range = AutoUseItemsMidas.AddToggle("Only range-creeps"),
	AutoUseItemsMidas_CheckBIG = AutoUseItemsMidas.AddToggle("Check on big creeps")

let AutoUseItemsUrn = SettingsAutoItems.AddNode("Urn / Vessel"),
	AutoUseItemsUrnAlies = AutoUseItemsUrn.AddToggle("Use Urn for Allies"),
	AutoUseItemsUrnAliesAlliesHP = AutoUseItemsUrn.AddSlider("HP for use allies", 300, 1, 1000),

	AutoUseItemsUrnEnemy = AutoUseItemsUrn.AddToggle("Use Urn for Enemy"),
	AutoUseItemsUrnAliesEnemyHP = AutoUseItemsUrn.AddSlider("HP for use enemy", 200, 1, 1000)

let AutoUseItemsMjollnir = SettingsAutoItems.AddNode("Mjollnir"),
	AutoUseItemsMjollnir_val = AutoUseItemsMjollnir.AddSlider("Distance from enemy", 600, 150, 2000)

export {
	MenuBase, Items,
	State, ItemsForUse,
	AutoUseItemsMG_val,
	AutoUseItemsSticks_val,
	AutoUseItemsCheese_val,
	AutoUseItemsArcane_val,
	AutoUseItemsBloodHP_val,
	AutoUseItemsBloodMP_val,
	AutoUseItemsMidas_range,
	AutoUseItemsMidas_CheckBIG,
	AutoUseItemsFaerieFire_val,
	AutoUseItemsUrnAlies,
	AutoUseItemsUrnAliesAlliesHP,
	AutoUseItemsUrnEnemy,
	AutoUseItemsUrnAliesEnemyHP,
	AutoUseItemsPhase_val,
	AutoUseItemsPhaseBootsState,
	AutoUseItemsMjollnir_val
}
