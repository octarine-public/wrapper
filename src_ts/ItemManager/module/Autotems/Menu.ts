import { Menu, MenuBase } from "../../abstract/MenuBase"
const { BaseTree, State } = MenuBase(Menu, "Auto Items")
State.SetToolTip("Auto use items");

let ItemsForUse = BaseTree.AddListBox("Items for use", 
	[
		"Phase Boots", 
		"Stick",
		"Faerie Fire", 
		"Cheese",
		"Arcane Boots",
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


export { 
	MenuBase,
	State, ItemsForUse,
	AutoUseItemsSticks_val,
	AutoUseItemsCheese_val,
	AutoUseItemsArcane_val,
	AutoUseItemsFaerieFire_val
}