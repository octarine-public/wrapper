import { Hero } from "wrapper/Imports"
import { ItemBase } from "../../Base/Items"
import { ProjList } from "../Listeners"
export default class TinkerItems extends ItemBase {

	constructor(unit: Hero) {
		super(unit)
	}
	public get EtherealDelay(): number | boolean {
		return this.ProjectileDelay(this.particle_arr[0], this.Ethereal, ProjList, this.Dagon)
	}
	private particle_arr: string[] = [
		"particles/items_fx/ethereal_blade.vpcf",
	]
}