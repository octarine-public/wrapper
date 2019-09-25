import { Hero } from "wrapper/Imports"
import { ItemBase } from "../../Base/Items"
import { ProjList } from "../Listeners"
export default class SkywrathMageItems extends ItemBase {
	constructor(unit: Hero) {
		super(unit)
	}
	public get EtherealDelay(): number | boolean {
		return this.ItemProjectileDelay(this.particle_arr[0], this.Ethereal, ProjList)
	}
	public get RodofAtosDelay(): number | boolean {
		return this.ItemProjectileDelay(this.particle_arr[1], this.RodofAtos, ProjList)
	}

	private particle_arr: string[] = [
		"particles/items_fx/ethereal_blade.vpcf",
		"particles/items2_fx/rod_of_atos_attack.vpcf",
	]
}