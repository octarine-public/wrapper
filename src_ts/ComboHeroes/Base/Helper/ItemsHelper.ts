import { Entity, Game, Hero, Item, TrackingProjectile, Ability } from "wrapper/Imports"
import { AbilityHelper } from "./AbilityHelper"
export class ItemsHelper extends AbilityHelper {
	public readonly Tick: number = ((Game.Ping / 2) + 30) // 30 tick
	constructor(unit: Hero) {
		super(unit)
	}
	public ProjectileDelay(proj_name: string, Item: Item, ProjList: TrackingProjectile[], ability: Ability | Item): number | boolean {
		let Projectile = ProjList.find(x => x.HadHitTargetLoc)
		return (
			Projectile !== undefined
			&& Item !== undefined
			&& Projectile.ParticlePath === proj_name
			&& ((this.unit.Distance2D(Projectile.Target as Entity) / Projectile.Speed * 1000) - this.CastDelay(ability))
		)
	}
	public ItemCastRange(Item: Item, GetSpecialValue: string): number {
		return Item.GetSpecialValue(GetSpecialValue) + this.unit.CastRangeBonus
	}
}