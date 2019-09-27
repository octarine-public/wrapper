import { Hero } from "wrapper/Imports"
import { ItemBase } from "../../Base/Items"
import { ProjList } from "../Listeners"
import InitAbility from "./Abilities"
export default class SkywrathMageItems extends ItemBase {
	private m_Ability: InitAbility = new InitAbility(this.unit)
	constructor(unit: Hero) {
		super(unit)
	}
	public get EtherealDelay(): number | boolean {
		let Delay = this.ProjectileDelay(this.particle_arr[0], this.Ethereal, ProjList, this.Dagon)
		return Delay !== 0 ? Delay : false
	}
	public get RodofAtosDelay(): number | boolean {
		let Delay = this.ProjectileDelay(this.particle_arr[1], this.RodofAtos, ProjList, this.m_Ability.MysticFlare)
		return Delay !== 0 ? Delay : false
	}

	private particle_arr: string[] = [
		"particles/items_fx/ethereal_blade.vpcf",
		"particles/items2_fx/rod_of_atos_attack.vpcf",
	]
}