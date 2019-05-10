import * as Orders from "Orders"
import { Combo, EComboAction } from "wrapper/Combo"

var combo = new Combo(),
	hotkey: number = 0,
	executing: boolean = false

combo.addAbility("item_armlet", EComboAction.TOGGLE)
combo.addAbility("item_buckler", EComboAction.NO_TARGET)
combo.addAbility("item_crimson_guard", EComboAction.NO_TARGET)
combo.addAbility("item_black_king_bar", EComboAction.NO_TARGET)
combo.addAbility("item_lotus_orb", EComboAction.SELF)
combo.addAbility("item_mjollnir", EComboAction.SELF)
combo.addAbility("legion_commander_press_the_attack", EComboAction.SELF)
combo.addAbility("item_blade_mail", EComboAction.NO_TARGET)
combo.addAbility("item_blink", EComboAction.CURSOR_ENEMY)
combo.addLinkenBreaker()
combo.addAbility(/item_(solar_crest|medallion_of_courage)/, EComboAction.CURSOR_ENEMY)
combo.addAbility(/item_(bloodthorn|orchid)/, EComboAction.CURSOR_ENEMY)
combo.addAbility(/item_dagon/, EComboAction.CURSOR_ENEMY)
combo.addAbility(/item_(urn_of_shadows|spirit_vessel)/, EComboAction.CURSOR_ENEMY)
combo.addAbility("item_shivas_guard", EComboAction.NO_TARGET)
combo.addAbility("item_satanic", EComboAction.CURSOR_ENEMY)
combo.addAbility("legion_commander_duel", EComboAction.CURSOR_ENEMY)

Events.on("onWndProc", (message_type, wParam) => {
	if (executing || !IsInGame() || parseInt(wParam as any) !== hotkey)
		return true
	if (message_type === 0x100) { // WM_KEYDOWN
		executing = true
		combo.execute(LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC, () => executing = false)
		return false
	}
	return true
})

{
	let root = new Menu_Node("LC Combo")
	root.entries.push(new Menu_Keybind (
		"Hotkey",
		hotkey,
		node => hotkey = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
