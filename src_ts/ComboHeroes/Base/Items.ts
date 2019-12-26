//@ts-nocheck
import { Item } from "wrapper/Imports"
import { ItemsHelper } from "./Helper/ItemsHelper"

export class ItemBase extends ItemsHelper {
	public get Abyssal(): Nullable<Item> {
		let name = "item_abyssal_blade"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Armlet(): Nullable<Item> {
		let name = "item_armlet"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get BlackKingBar(): Nullable<Item> {
		let name = "item_black_king_bar"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get DiffusalBlade(): Nullable<Item> {
		let name = "item_diffusal_blade"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Blink(): Nullable<Item> {
		let name = "item_blink"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Sheeps(): Nullable<Item> {
		let name = "item_sheepstick"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Sphere(): Nullable<Item> {
		let name = "item_sphere"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Orchid(): Nullable<Item> {
		let name = "item_orchid"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get InvisSword(): Nullable<Item> {
		let name = "item_invis_sword"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get SilverEdge(): Nullable<Item> {
		let name = "item_silver_edge"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Bloodthorn(): Nullable<Item> {
		let name = "item_bloodthorn"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get RodofAtos(): Nullable<Item> {
		let name = "item_rod_of_atos"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get ClumsyNet(): Nullable<Item> {
		let name = "item_clumsy_net"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Discord(): Nullable<Item> {
		let name = "item_veil_of_discord"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Ethereal(): Nullable<Item> {
		let name = "item_ethereal_blade"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Dagon(): Nullable<Item> {
		let name = "item_dagon_5"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(/item_dagon/)
	}
	public get Cyclone(): Nullable<Item> {
		let name = "item_cyclone"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get AeonDisk(): Nullable<Item> {
		let name = "item_aeon_disk"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Shivas(): Nullable<Item> {
		let name = "item_shivas_guard"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get SpiritVesel(): Nullable<Item> {
		let name = "item_spirit_vessel"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get UrnOfShadows(): Nullable<Item> {
		let name = "item_urn_of_shadows"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Nullifier(): Nullable<Item> {
		let name = "item_nullifier"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get ForceStaff(): Nullable<Item> {
		let name = "item_force_staff"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get HurricanePike(): Nullable<Item> {
		let name = "item_hurricane_pike"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Manta(): Nullable<Item> {
		let name = "item_manta"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get BladeMail(): Nullable<Item> {
		let name = "item_blade_mail"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Medallion(): Nullable<Item> {
		let name = "item_medallion_of_courage"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get SolarCrest(): Nullable<Item> {
		let name = "item_solar_crest"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Satanic(): Nullable<Item> {
		let name = "item_satanic"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Mjollnir(): Nullable<Item> {
		let name = "item_mjollnir"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Necronomicon(): Nullable<Item> {
		let name = "item_necronomicon_3"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get LotusOrb(): Nullable<Item> {
		let name = "item_lotus_orb"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get HeavensHalberd(): Nullable<Item> {
		let name = "item_heavens_halberd"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Soulring(): Nullable<Item> {
		let name = "item_soul_ring"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get TravelBoot(): Nullable<Item> {
		let name = "item_travel_boots_1"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(/item_travel_boots/)
	}
	public get Bottle(): Nullable<Item> {
		let name = "item_bottle"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Greaves(): Nullable<Item> {
		let name = "item_guardian_greaves"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Lens(): Nullable<Item> {
		let name = "item_aether_lens"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Ghost(): Nullable<Item> {
		let name = "item_ghost"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Glimmer(): Nullable<Item> {
		let name = "item_glimmer_cape"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get RefresherShard(): Nullable<Item> {
		let name = "item_refresher_shard"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Refresher(): Nullable<Item> {
		let name = "item_refresher"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
}
