import { Menu, MenuBase } from "../../abstract/MenuBase"
const { BaseTree, State } = MenuBase(Menu, "Auto Items")
State.SetToolTip("Auto use items");

let ItemsTree = BaseTree.AddTree("Select Items")
let ItemsForUse = ItemsTree.AddListBox("Select items for use", 
	[
		"Phase Boots", 
		"Stick",
		"Faerie Fire", 
		"Cheese",
		"Arcane Boots",
		"Mekansm / Graves",
		"Bottle",
		"Bloodstone",
		"Buckler",
		"Midas",
		"Urn of Shadows / Spirit Vessel",
		"Dust Of Apperance"
	]
)

// Settings Items
let SettingsAutoItems = BaseTree.AddTree("Items settings"),
	AutoUseItemsSticks = SettingsAutoItems.AddTree("Stick"),
	AutoUseItemsSticks_val = AutoUseItemsSticks.AddSlider("HP precent (%)", 10, 1, 99);
	
let AutoUseItemsFaerieFire = SettingsAutoItems.AddTree("Faerie Fire"),
	AutoUseItemsFaerieFire_val = AutoUseItemsFaerieFire.AddSlider("HP for use", 100, 1, 1000);

let AutoUseItemsCheese = SettingsAutoItems.AddTree("Cheese"),
	AutoUseItemsCheese_val = AutoUseItemsCheese.AddSlider("HP precent (%)", 10, 1, 99);

let AutoUseItemsArcane = SettingsAutoItems.AddTree("Arcane Boots"),
	AutoUseItemsArcane_val = AutoUseItemsArcane.AddSlider("MP precent (%)", 10, 1, 99);
	
let AutoUseItemsMG = SettingsAutoItems.AddTree("Mekansm / Graves"),
	AutoUseItemsMG_val = AutoUseItemsMG.AddSlider("HP precent (%)", 10, 1, 99);

let AutoUseItemsBlood = SettingsAutoItems.AddTree("Bloodstone"),
	AutoUseItemsBloodHP_val = AutoUseItemsBlood.AddSlider("HP precent (%)", 10, 1, 99),
	AutoUseItemsBloodMP_val = AutoUseItemsBlood.AddSlider("Min mana precent (%)", 7, 1, 100);

let AutoUseItemsMidas = SettingsAutoItems.AddTree("Midas"),
	AutoUseItemsMidas_range = AutoUseItemsMidas.AddToggle("Only range-creeps"),
	AutoUseItemsMidas_CheckBIG = AutoUseItemsMidas.AddToggle("Check on big creeps");
	
let AutoUseItemsUrn = SettingsAutoItems.AddTree("Urn of Shadows / Spirit Vessel"),
	AutoUseItemsUrnAlies = AutoUseItemsUrn.AddToggle("Use Urn for Allies"),
	AutoUseItemsUrnAliesAlliesHP = AutoUseItemsUrn.AddSlider("HP for use allies", 300, 1, 1000),

	AutoUseItemsUrnEnemy = AutoUseItemsUrn.AddToggle("Use Urn for Enemy"),
	AutoUseItemsUrnAliesEnemyHP = AutoUseItemsUrn.AddSlider("HP for use enemy", 200, 1, 1000);
	
	
export { 
	MenuBase,
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
	AutoUseItemsUrnAliesEnemyHP
}