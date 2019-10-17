import { Menu, MenuBase } from "../../abstract/MenuBase"
import InitItems from "../../abstract/Items"
const { BaseTree, State } = MenuBase(Menu, "Auto Items")
State.SetTooltip("Auto use items")

let Items = new InitItems(undefined)

// loop-optimizer: KEEP
let Items_array: string[] = [
	Items.Abyssal.toString(),
	Items.PhaseBoots.toString(),
	Items.MagicStick.toString(),
	Items.MagicWand.toString(),
	Items.SoulRing.toString(),
	Items.Midas.toString(),
	Items.ArcaneBoots.toString(),
	Items.Mekansm.toString(),
	Items.GuardianGreaves.toString(),
	Items.Bottle.toString(),
	Items.UrnOfShadows.toString(),
	Items.SpiritVesel.toString(),
	Items.Bloodstone.toString(),
	Items.Tango.toString(),
	Items.FaerieFire.toString(),
	Items.Dust.toString(),
	Items.Buckler.toString(),
	Items.Cheese.toString(),
	Items.Mjollnir.toString(),
	Items.SolarCrest.toString(),
	Items.Medallion.toString(),
	Items.Janggo.toString(),
	Items.DiffusalBlade.toString(),
	Items.PowerTreads.toString()
]
let ItemsForUse = BaseTree.AddImageSelector("Select items for use", Items_array)

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

let AutoUseItemsSouring = SettingsAutoItems.AddNode("Soul Ring"),
	AutoUseItemsSouringInvis = AutoUseItemsSouring.AddToggle("Use when invisible"),
	AutoUseItemsSouringHP_val = AutoUseItemsSouring.AddSlider("HP(%) threshold ", 70, 0, 100),
	AutoUseItemsSouringMP_val = AutoUseItemsSouring.AddSlider("MP(%) threshold", 100, 0, 100),
	AutoUseItemsSouringMPUse_val = AutoUseItemsSouring.AddSlider("MP ability threshold", 25, 0, 100)

	
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

let AutoUseItemsBluker = SettingsAutoItems.AddNode("Buckler"),
	AutoUseItemsBluker_val = AutoUseItemsBluker.AddSlider("Distance from enemy", 1000, 150, 2000)
	
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
	AutoUseItemsMjollnir_val,
	AutoUseItemsBluker_val,
	AutoUseItemsSouringHP_val,
	AutoUseItemsSouringMP_val,
	AutoUseItemsSouringInvis,
	AutoUseItemsSouringMPUse_val
}
