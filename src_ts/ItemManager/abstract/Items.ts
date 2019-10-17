import { Item, Unit } from "wrapper/Imports"
import ItemManagerBase from "./Base"

export default class ItemBase extends ItemManagerBase {
	public unit: Unit
	constructor(unit: Unit) {
		super(unit)
	}
	public get Abyssal(): Item {
		let name = "item_abyssal_blade"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get ArcaneBoots(): Item {
		let name = "item_arcane_boots"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Buckler(): Item {
		let name = "item_buckler"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Dust(): Item {
		let name = "item_dust"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Bottle(): Item {
		let name = "item_bottle"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Bloodstone(): Item {
		let name = "item_bloodstone"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Cheese(): Item {
		let name = "item_cheese"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get FaerieFire(): Item {
		let name = "item_faerie_fire"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Gem(): Item {
		let name = "item_gem"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get PhaseBoots(): Item {
		let name = "item_phase_boots"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get SpiritVesel(): Item {
		let name = "item_spirit_vessel"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get UrnOfShadows(): Item {
		let name = "item_urn_of_shadows"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get SolarCrest(): Item {
		let name = "item_solar_crest"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Medallion(): Item {
		let name = "item_medallion_of_courage"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Janggo(): Item {
		let name = "item_ancient_janggo"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Mjollnir(): Item {
		let name = "item_mjollnir"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get MagicStick(): Item {
		let name = "item_magic_stick"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get MagicWand(): Item {
		let name = "item_magic_wand"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Mekansm(): Item {
		let name = "item_mekansm"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get GuardianGreaves(): Item {
		let name = "item_guardian_greaves"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Midas(): Item {
		let name = "item_hand_of_midas"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get SoulRing(): Item {
		let name = "item_soul_ring"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Tango(): Item {
		let name = "item_tango"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(/item_tango/)
	}
	public get PowerTreads(): Item  {
		let name = "item_power_treads"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get DiffusalBlade(): Item {
		let name = "item_diffusal_blade"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get ActiveAttribute(): Attributes {
		let att = this.PowerTreads
		if (att === undefined){
			return Attributes.DOTA_ATTRIBUTE_STRENGTH
		}
		let _PowerTreads = att.m_pBaseEntity as C_DOTA_Item_PowerTreads
		return _PowerTreads.m_iStat
	}
}