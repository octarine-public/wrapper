import { Entity, Hero, Item, TrackingProjectile, Ability } from "wrapper/Imports"
import { AbilityHelper } from "./AbilityHelper"
export class ItemsHelper extends AbilityHelper {
	constructor(unit: Hero) {
		super(unit)
	}
	public get Tick() {
		return GetLatency(Flow_t.IN) + 1000 / 30 * 1.5
	}
	public ProjectileDelay(proj_name: string, Item: Item, ProjList: TrackingProjectile[], ability: Ability | Item): number {
		let Projectile = ProjList.find(x => x.HadHitTargetLoc && x.ParticlePath === proj_name)
		if (Projectile !== undefined && Item !== undefined)
			return (this.unit.Distance2D(Projectile.Target as Entity) / Projectile.Speed * 1000) - this.CastDelay(ability)
		return 0
	}
	public ItemCastRange(Item: Item, GetSpecialValue: string): number {
		return Item.GetSpecialValue(GetSpecialValue) + this.unit.CastRangeBonus
	}
}