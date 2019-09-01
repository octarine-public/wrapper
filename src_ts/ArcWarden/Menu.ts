import { Menu } from "wrapper/Imports"

let MyItems: string[] = [
		'item_black_king_bar',
		'item_solar_crest',
		'item_medallion_of_courage',
		'item_necronomicon_3',
		'item_diffusal_blade',
		'item_blink',
		'item_lotus_orb',
		'item_mjollnir',
		'item_ethereal_blade',
		'item_dagon_5',
		'item_rod_of_atos',
		'item_manta',
		'item_orchid',
		'item_bloodthorn',
		'item_nullifier',
		'item_satanic',
		'item_shivas_guard',
		'item_sheepstick',
	],
	MyAbility: string[] = [
		"arc_warden_tempest_double",
		"arc_warden_flux",
		"arc_warden_spark_wraith",
		"arc_warden_magnetic_field",
	];
	
let MenuArc = Menu.AddEntry(["Heroes", "Arc Warden"]),
	State = MenuArc.AddToggle("State"),
	KeyCombo = MenuArc.AddKeybind("Combo Key"),
	DrawTargetParticle = MenuArc.AddToggle("Draw line to target"),
	CursorPos = MenuArc.AddSlider("Find target at cursor radius", 200, 100, 1000),
	BlinkRadius = MenuArc.AddSlider("Blink distance from enemy", 200, 0, 800);

	
let ability_items_settings = MenuArc.AddNode("Abilities | Items"),
	Items_settings = ability_items_settings.AddImageSelector("Select Items", MyItems),
	Ability_settings = ability_items_settings.AddImageSelector("Select Ability", MyAbility)

export { State, CursorPos, KeyCombo, MyItems, MyAbility, Items_settings, Ability_settings, BlinkRadius, DrawTargetParticle }