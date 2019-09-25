import { Entity, Game, Hero, Item, TrackingProjectile } from "wrapper/Imports"
export class ItemsHelper  {
	public readonly unit: Hero
	public readonly Tick: number = ((Game.Ping / 2) + 30) // 30 tick
	constructor(unit: Hero) {
		this.unit = unit
	}
	public ItemProjectileDelay(proj_name: string, Item: Item, ProjList: TrackingProjectile[]): number | boolean {
		let Projectile = ProjList.find(x => x.HadHitTargetLoc)
		return (
			Projectile !== undefined
			&& Item !== undefined
			&& Projectile.ParticlePath === proj_name
			&& this.unit.Distance2D(Projectile.Target as Entity) / Projectile.Speed * 1000
		)
	}
	public ItemCastRange(Item: Item, GetSpecialValue: string): number {
		return Item.GetSpecialValue(GetSpecialValue) + this.unit.CastRangeBonus
	}
}