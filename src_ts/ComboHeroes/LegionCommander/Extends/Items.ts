//@ts-nocheck
import { Hero, Item } from "wrapper/Imports"
import { ItemBase } from "../Base/Items"
import { ProjList } from "../Listeners"

export default class LegionCommanderItems extends ItemBase {
	private particle_arr: string[] = [
		"particles/items_fx/ethereal_blade.vpcf",
		"particles/items2_fx/rod_of_atos_attack.vpcf",
	]
	constructor(unit?: Hero) {
		super(unit)
	}
	// tested
	public get AeonDisc(): Item {
		return this.unit.GetItemByName("item_combo_breaker")
	}
	public get EtherealDelay(): number {
		return this.ProjectileDelay(this.particle_arr[0], this.Ethereal, ProjList, this.Ethereal)
	}
	public get RodofAtosDelay(): number {
		return this.ProjectileDelay(this.particle_arr[1], this.RodofAtos, ProjList, this.RodofAtos)
	}
}
