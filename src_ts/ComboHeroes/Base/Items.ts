import { Hero, Item } from "wrapper/Imports"
import { ItemsHelper } from "./Helper/ItemsHelper"

export class ItemBase extends ItemsHelper {
	constructor(unit: Hero) {
		super(unit)
	}
 	public get Abyssal(): Item {
		return this.unit.GetItemByName("item_abyssal_blade")
	}
	public get Armlet(): Item {
		return this.unit.GetItemByName("item_armlet")
	}
	public get BlackKingBar(): Item {
		return this.unit.GetItemByName("item_black_king_bar")
	}
	public get Blink(): Item {
		return this.unit.GetItemByName("item_blink")
	}
	public get Sheeps(): Item {
		return this.unit.GetItemByName("item_sheepstick")
	}
	public get Sphere(): Item {
		return this.unit.GetItemByName("item_sphere")
	}
	public get Orchid(): Item {
		return this.unit.GetItemByName("item_orchid")
	}
	public get Bloodthorn(): Item {
		return this.unit.GetItemByName("item_bloodthorn")
	}
	public get RodofAtos(): Item {
		return this.unit.GetItemByName("item_rod_of_atos")
	}
	public get Discord(): Item {
		return this.unit.GetItemByName("item_veil_of_discord")
	}
	public get Ethereal(): Item {
		return this.unit.GetItemByName("item_ethereal_blade")
	}
	public get Dagon(): Item {
		return this.unit.GetItemByName(/item_dagon/)
	}
	public get Cyclone(): Item {
		return this.unit.GetItemByName("item_cyclone")
	}
	public get AeonDisk(): Item {
		return this.unit.GetItemByName("item_aeon_disk")
	}
	public get Shivas(): Item {
		return this.unit.GetItemByName("item_shivas_guard")
	}
	public get SpiritVesel(): Item {
		return this.unit.GetItemByName("item_spirit_vessel")
	}
	public get UrnOfShadows(): Item {
		return this.unit.GetItemByName("item_urn_of_shadows")
	}
	public get Nullifier(): Item {
		return this.unit.GetItemByName("item_nullifier")
	}
	public get ForceStaff(): Item {
		return this.unit.GetItemByName("item_force_staff")
	}
	public get BladMail(): Item {
		return this.unit.GetItemByName("item_blade_mail")
	}
	public get SolarCrest(): Item {
		return this.unit.GetItemByName("item_solar_crest") || this.unit.GetItemByName("item_medallion_of_courage")
	}
	public get Satanic(): Item {
		return this.unit.GetItemByName("item_satanic")
	}
	public get Mjollnir(): Item {
		return this.unit.GetItemByName("item_mjollnir")
	}
	public get Necronomicon(): Item {
		return this.unit.GetItemByName(/item_necronomicon/)
	}
	public get LotusOrb(): Item {
		return this.unit.GetItemByName("item_lotus_orb")
	}
	public get HeavensHalberd(): Item {
		return this.unit.GetItemByName("item_heavens_halberd")
	}
}