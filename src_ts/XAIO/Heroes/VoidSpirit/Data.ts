import {
	Ability,
	item_blink,
	void_spirit_aether_remnant,
	void_spirit_astral_step,
	item_diffusal_blade,
	item_medallion_of_courage,
	item_solar_crest,
	item_blade_mail,
	item_lotus_orb,
	item_satanic,
	item_urn_of_shadows,
	item_spirit_vessel,
	item_sheepstick,
	item_orchid,
	item_bloodthorn,
	item_shivas_guard,
	item_nullifier,
	void_spirit_resonant_pulse,
	void_spirit_dissimilate,
	item_ethereal_blade,
	item_veil_of_discord,
	item_dagon
} from "wrapper/Imports"

export let execute_ability: (typeof Ability[]) = [
	void_spirit_aether_remnant,
	void_spirit_astral_step,
	item_diffusal_blade,
	item_medallion_of_courage,
	item_solar_crest,
	item_blade_mail,
	item_lotus_orb,
	item_satanic,
	item_veil_of_discord,
	item_ethereal_blade,
	item_dagon,
	item_urn_of_shadows,
	item_spirit_vessel,
	item_sheepstick,
	item_orchid,
	item_bloodthorn,
	item_shivas_guard,
	item_nullifier,
	void_spirit_resonant_pulse,
	void_spirit_dissimilate
]

export let array_ability_render: (typeof Ability[]) = [
	item_blink,
	void_spirit_dissimilate,
	void_spirit_astral_step,
	void_spirit_aether_remnant,
	void_spirit_resonant_pulse,
]

export let menu_items: string[] = [
	"item_diffusal_blade",
	"item_medallion_of_courage",
	"item_solar_crest",
	"item_blade_mail",
	"item_lotus_orb",
	"item_satanic",
	"item_urn_of_shadows",
	"item_spirit_vessel",
	"item_sheepstick",
	"item_orchid",
	"item_veil_of_discord",
	"item_ethereal_blade",
	"item_dagon_5",
	"item_bloodthorn",
	"item_shivas_guard",
	"item_nullifier",
]

export let menu_ability: string[] = [
	"void_spirit_aether_remnant",
	"void_spirit_dissimilate",
	"void_spirit_resonant_pulse",
	"void_spirit_astral_step",
]

export let array_void_radiuses_menu: string[] = [
	...menu_ability, "item_blink"
]