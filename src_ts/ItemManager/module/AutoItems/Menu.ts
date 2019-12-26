import { Menu, MenuBase } from "../../abstract/MenuBase"
export const { BaseTree, State } = MenuBase(Menu, "Auto Items")
State.SetTooltip("Auto use items")

// loop-optimizer: KEEP
const Items_array: string[] = [
	"item_arcane_ring",
	"item_blink",
	"item_phase_boots",
	"item_magic_stick",
	"item_magic_wand",
	"item_soul_ring",
	"item_hand_of_midas",
	"item_arcane_boots",
	"item_mekansm",
	"item_guardian_greaves",
	"item_bottle",
	"item_urn_of_shadows",
	"item_spirit_vessel",
	"item_bloodstone",
	"item_tango",
	"item_faerie_fire",
	"item_greater_faerie_fire",
	"item_dust",
	"item_cheese",
	"item_mjollnir",
	"item_solar_crest",
	"item_medallion_of_courage",
	"item_ancient_janggo",
	"item_royal_jelly",
	"item_essence_ring",
	"item_iron_talon",
	"item_diffusal_blade",
	"item_power_treads",
]
export const ItemsForUse = BaseTree.AddImageSelector("Items for use", Items_array)

// Settings Items
const SettingsAutoItems = BaseTree.AddNode("Items settings")
export const AutoUseItemsBottle = SettingsAutoItems.AddNode("Bottle")
export const AutoUseItemsBottleAllies = AutoUseItemsBottle.AddToggle("Allies after tp/base")
export const AutoUseItemsBottleState = AutoUseItemsBottle.AddToggle("Activate bounty runes", true)

export const AutoUseItemsMedal = SettingsAutoItems.AddNode("SolarCrest / Medallion")
export const AutoUseItemsMedal_val = AutoUseItemsMedal.AddSwitcher("Select", ["All units", "Only allies", "Only enemy"])

export const AutoUseItemsSticks = SettingsAutoItems.AddNode("Stick")
export const AutoUseItemsSticks_val = AutoUseItemsSticks.AddSlider("HP (%)", 10, 1, 99)

const AutoUseItemsTango = SettingsAutoItems.AddNode("Tango")
export const AutoUseItemsTango_val = AutoUseItemsTango.AddSlider("HP (%)", 2, 2, 100)

const AutoUseItemsTalon = SettingsAutoItems.AddNode("Talon")
export const AutoUseItemsTalon_val = AutoUseItemsTalon.AddSwitcher("Mode", ["Only neutrals", "All Creeps"], 0)
export const AutoUseItemsTalonCreepHP = AutoUseItemsTalon.AddSlider("Creep min HP (%)", 100, 1, 100)

const AutoUseItemsPhaseBoots = SettingsAutoItems.AddNode("Phase Boots")
export const AutoUseItemsPhaseBootsState = AutoUseItemsPhaseBoots.AddToggle("Check from enemy")
export const AutoUseItemsPhase_val = AutoUseItemsPhaseBoots.AddSlider("Distance", 300, 150, 2000)

const AutoUseItemsFaerieFire = SettingsAutoItems.AddNode("Faerie Fire")
export const AutoUseItemsFaerieFire_val = AutoUseItemsFaerieFire.AddSlider("HP (min) for use", 100, 1, 1000)

const AutoUseItemsBigFaerieFire = SettingsAutoItems.AddNode("Greater Faerie Fire")
export const AutoUseItemsBigFaerieFire_val = AutoUseItemsBigFaerieFire.AddSlider("HP (%)", 5, 1, 99)

const AutoUseItemsEssenceRing = SettingsAutoItems.AddNode("Essence Ring")
export const AutoUseItemsEssenceRing_val = AutoUseItemsEssenceRing.AddSlider("HP (%)", 5, 1, 99)

const AutoUseItemsCheese = SettingsAutoItems.AddNode("Cheese")
export const AutoUseItemsCheese_val = AutoUseItemsCheese.AddSlider("HP (%)", 10, 1, 99)

const AutoUseItemsArcane = SettingsAutoItems.AddNode("Arcane Boots")
export const AutoUseItemsArcane_val = AutoUseItemsArcane.AddSlider("MP (%)", 10, 1, 99)

const AutoUseItemsArcaneRing = SettingsAutoItems.AddNode("Arcane Ring")
export const AutoUseItemsArcanering_val = AutoUseItemsArcaneRing.AddSlider("MP (min) for use", 150, 1, 500)

const AutoUseItemsMG = SettingsAutoItems.AddNode("Mekansm / Graves")
export const AutoUseItemsMG_val = AutoUseItemsMG.AddSlider("HP precent (%)", 10, 1, 99)

const AutoUseItemsSouring = SettingsAutoItems.AddNode("Soul Ring")
export const AutoUseItemsSouringInvis = AutoUseItemsSouring.AddToggle("Use when invisible")
export const AutoUseItemsSouringHP_val = AutoUseItemsSouring.AddSlider("HP(%) threshold ", 70, 0, 100)
export const AutoUseItemsSouringMP_val = AutoUseItemsSouring.AddSlider("MP(%) threshold", 100, 0, 100)
export const AutoUseItemsSouringMPUse_val = AutoUseItemsSouring.AddSlider("MP ability threshold", 25, 0, 100)

const AutoUseItemsBlood = SettingsAutoItems.AddNode("Bloodstone")
export const AutoUseItemsBloodHP_val = AutoUseItemsBlood.AddSlider("HP precent (%)", 10, 1, 99)
export const AutoUseItemsBloodMP_val = AutoUseItemsBlood.AddSlider("Min mana precent (%)", 7, 1, 100)

const AutoUseItemsMidas = SettingsAutoItems.AddNode("Midas")
export const AutoUseItemsMidas_range = AutoUseItemsMidas.AddToggle("Only range-creeps")
export const AutoUseItemsMidas_CheckBIG = AutoUseItemsMidas.AddToggle("Check on big creeps")

const AutoUseItemsUrn = SettingsAutoItems.AddNode("Urn / Vessel")
export const AutoUseItemsUrnAlies = AutoUseItemsUrn.AddToggle("Use Urn for Allies")
export const AutoUseItemsUrnAliesAlliesHP = AutoUseItemsUrn.AddSlider("HP for use allies", 300, 1, 1000)
export const AutoUseItemsUrnEnemy = AutoUseItemsUrn.AddToggle("Use Urn for Enemy")
export const AutoUseItemsUrnAliesEnemyHP = AutoUseItemsUrn.AddSlider("HP for use enemy", 200, 1, 1000)

const AutoUseItemsMjollnir = SettingsAutoItems.AddNode("Mjollnir")
export const AutoUseItemsMjollnir_val = AutoUseItemsMjollnir.AddSlider("Distance from enemy", 600, 150, 2000)
