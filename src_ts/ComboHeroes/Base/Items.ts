import { Item } from "wrapper/Imports"
import { ItemsHelper } from "./Helper/ItemsHelper"

export class ItemBase extends ItemsHelper {
	public get Abyssal(): Item {
		let name = "item_abyssal_blade"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Armlet(): Item {
		let name = "item_armlet"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get BlackKingBar(): Item {
		let name = "item_black_king_bar"
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
	public get Blink(): Item {
		let name = "item_blink"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Sheeps(): Item {
		let name = "item_sheepstick"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Sphere(): Item {
		let name = "item_sphere"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Orchid(): Item {
		let name = "item_orchid"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get InvisSword(): Item {
		let name = "item_invis_sword"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get SilverEdge(): Item {
		let name = "item_silver_edge"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Bloodthorn(): Item {
		let name = "item_bloodthorn"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get RodofAtos(): Item {
		let name = "item_rod_of_atos"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get ClumsyNet(): Item {
		let name = "item_clumsy_net"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Discord(): Item {
		let name = "item_veil_of_discord"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Ethereal(): Item {
		let name = "item_ethereal_blade"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Dagon(): Item {
		let name = "item_dagon_5"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(/item_dagon/)
	}
	public get Cyclone(): Item {
		let name = "item_cyclone"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get AeonDisk(): Item {
		let name = "item_aeon_disk"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Shivas(): Item {
		let name = "item_shivas_guard"
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
	public get Nullifier(): Item {
		let name = "item_nullifier"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get ForceStaff(): Item {
		let name = "item_force_staff"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get HurricanePike(): Item {
		let name = "item_hurricane_pike"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}

	public get BladeMail(): Item {
		let name = "item_blade_mail"
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
	public get SolarCrest(): Item {
		let name = "item_solar_crest"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Satanic(): Item {
		let name = "item_satanic"
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
	public get Necronomicon(): Item {
		let name = "item_necronomicon_3"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get LotusOrb(): Item {
		let name = "item_lotus_orb"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get HeavensHalberd(): Item {
		let name = "item_heavens_halberd"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Soulring(): Item {
		let name = "item_soul_ring"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get TravelBoot(): Item {
		let name = "item_travel_boots_1"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(/item_travel_boots/)
	}
	public get Bottle(): Item {
		let name = "item_bottle"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Greaves(): Item {
		let name = "item_guardian_greaves"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Lens(): Item {
		let name = "item_aether_lens"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Ghost(): Item {
		let name = "item_ghost"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Glimmer(): Item {
		let name = "item_glimmer_cape"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get RefresherShard(): Item {
		let name = "item_refresher_shard"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
	public get Refresher(): Item {
		let name = "item_refresher"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetItemByName(name)
	}
}