import { Item, Unit } from "wrapper/Imports"
export default class ItemBase {
	private unit: Unit
	constructor(unit: Unit) {
		this.unit = unit
	}
	public get Abyssal(): Item {
		let _Abyssal = this.unit.GetItemByName("item_abyssal_blade")
		return _Abyssal
	}
	public get ArcaneBoots(): Item {
		let _ArcaneBoots = this.unit.GetItemByName("item_arcane_boots")
		return _ArcaneBoots
	}
	public get Buckler(): Item {
		let _Buckler = this.unit.GetItemByName("item_buckler")
		return _Buckler
	}
	public get Dust(): Item {
		let _Dust = this.unit.GetItemByName("item_dust")
		return _Dust
	}
	public get Bottle(): Item {
		let _Bottle = this.unit.GetItemByName("item_bottle")
		return _Bottle
	}
	public get Bloodstone(): Item {
		let _Bloodstone = this.unit.GetItemByName("item_bloodstone")
		return _Bloodstone
	}
	public get Cheese(): Item {
		let _Cheese = this.unit.GetItemByName("item_cheese")
		return _Cheese
	}
	public get FaerieFire(): Item {
		let _FaerieFire = this.unit.GetItemByName("item_faerie_fire")
		return _FaerieFire
	}
	public get Gem(): Item {
		let _Gem = this.unit.GetItemByName("item_gem")
		return _Gem
	}
	public get PhaseBoots(): Item {
		let _PhaseBoots = this.unit.GetItemByName("item_phase_boots")
		return _PhaseBoots
	}
	public get SpiritVesel(): Item {
		let _SpiritVesel = this.unit.GetItemByName("item_spirit_vessel")
		return _SpiritVesel
	}
	public get UrnOfShadows(): Item {
		let _UrnOfShadows = this.unit.GetItemByName("item_urn_of_shadows")
		return _UrnOfShadows
	}
	public get SolarCrest(): Item {
		let _SolarCrest = this.unit.GetItemByName("item_solar_crest")
		return _SolarCrest
	}
	public get Mjollnir(): Item {
		let _Mjollnir = this.unit.GetItemByName("item_mjollnir")
		return _Mjollnir
	}
	public get MagicStick(): Item {
		let _MagicStick = this.unit.GetItemByName("item_magic_stick")
		return _MagicStick
	}
	public get MagicWand(): Item {
		let _MagicWand = this.unit.GetItemByName("item_magic_wand")
		return _MagicWand
	}
	public get Mekansm(): Item {
		let _Mekansm = this.unit.GetItemByName("item_mekansm")
		return _Mekansm
	}
	public get GuardianGreaves(): Item {
		let _GuardianGreaves = this.unit.GetItemByName("item_guardian_greaves")
		return _GuardianGreaves
	}
	public get Midas(): Item {
		let _Midas = this.unit.GetItemByName("item_hand_of_midas")
		return _Midas
	}
	public get Tango(): Item {
		let _Tango = this.unit.GetItemByName(/item_tango/)
		return _Tango
	}
}