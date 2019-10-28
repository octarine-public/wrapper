import { Entity, Hero, Item, TrackingProjectile, Ability, Unit, Game } from "wrapper/Imports"
import { AbilityHelper } from "./AbilityHelper"
export class ItemsHelper extends AbilityHelper {
	constructor(unit: Hero | Unit) {
		super(unit)
	}
	public get Tick() {
		return 100
	}
	// maybe is bad work
	public ProjectileDelay(proj_name: string, Item: Item, ProjList: TrackingProjectile[], ability: Ability | Item): number {
		let Projectile = ProjList.find(x => x.TargetLoc.Distance(x.Position) < x.Speed / 30 * 2 && x.ParticlePath === proj_name)
		if (Projectile !== undefined && Item !== undefined)
			return (this.unit.Distance2D(Projectile.Target as Entity) / Projectile.Speed * 1000) - this.CastDelay(ability)
		return 0
	}
	public ItemCastRange(Item: Item, GetSpecialValue: string): number {
		return Item.GetSpecialValue(GetSpecialValue) + this.unit.CastRangeBonus
	}
}