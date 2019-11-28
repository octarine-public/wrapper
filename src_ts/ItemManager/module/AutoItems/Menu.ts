import InitItems from "../../abstract/Items"
import { Menu, MenuBase } from "../../abstract/MenuBase"
export const { BaseTree, State } = MenuBase(Menu, "Auto Items")
State.SetTooltip("Auto use items")

const Items = new InitItems(undefined)

// loop-optimizer: KEEP
const Items_array: string[] = [
	Items.Abyssal.toString(),
	Items.ArcaneRing.toString(),
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
	Items.TangoSingle.toString(),
	Items.FaerieFire.toString(),
	Items.Dust.toString(),
	Items.Cheese.toString(),
	Items.Mjollnir.toString(),
	Items.SolarCrest.toString(),
	Items.Medallion.toString(),
	Items.Janggo.toString(),
	Items.Jelly.toString(),
	Items.EssenceRing.toString(),
	Items.Talon.toString(),
	// Items.Armlet.toString(),
	Items.DiffusalBlade.toString(),
	Items.PowerTreads.toString(),
]
export const ItemsForUse = BaseTree.AddImageSelector("Select items for use", Items_array)

// Settings Items
const SettingsAutoItems = BaseTree.AddNode("Items settings")
export const AutoUseItemsSticks = SettingsAutoItems.AddNode("Stick")
export const AutoUseItemsSticks_val = AutoUseItemsSticks.AddSlider("HP precent (%)", 10, 1, 99)

const AutoUseItemsTango = SettingsAutoItems.AddNode("Tango")
export const AutoUseItemsTango_val = AutoUseItemsTango.AddSlider("HP (min) for use", 450, 1, 1000)

const AutoUseItemsTalon = SettingsAutoItems.AddNode("Talon")
export const AutoUseItemsTalon_val = AutoUseItemsTalon.AddSwitcher("Mode", ["Only neutrals", "All Creeps"], 0)
export const AutoUseItemsTalonCreepHP = AutoUseItemsTalon.AddSlider("Creep min HP (%)", 100, 1, 100)

const AutoUseItemsPhaseBoots = SettingsAutoItems.AddNode("Phase Boots")
export const AutoUseItemsPhaseBootsState = AutoUseItemsPhaseBoots.AddToggle("Check from enemy")
export const AutoUseItemsPhase_val = AutoUseItemsPhaseBoots.AddSlider("Distance", 300, 150, 2000)

const AutoUseItemsFaerieFire = SettingsAutoItems.AddNode("Faerie Fire")
export const AutoUseItemsFaerieFire_val = AutoUseItemsFaerieFire.AddSlider("HP (min) for use", 100, 1, 1000)

const AutoUseItemsBigFaerieFire = SettingsAutoItems.AddNode("Greater Faerie Fire")
export const AutoUseItemsBigFaerieFire_val = AutoUseItemsBigFaerieFire.AddSlider("HP precent (%)", 5, 1, 99)

const AutoUseItemsEssenceRing = SettingsAutoItems.AddNode("Essence Ring")
export const AutoUseItemsEssenceRing_val = AutoUseItemsEssenceRing.AddSlider("HP precent (%)", 5, 1, 99)

const AutoUseItemsCheese = SettingsAutoItems.AddNode("Cheese")
export const AutoUseItemsCheese_val = AutoUseItemsCheese.AddSlider("HP precent (%)", 10, 1, 99)

const AutoUseItemsArcane = SettingsAutoItems.AddNode("Arcane Boots")
export const AutoUseItemsArcane_val = AutoUseItemsArcane.AddSlider("MP precent (%)", 10, 1, 99)

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