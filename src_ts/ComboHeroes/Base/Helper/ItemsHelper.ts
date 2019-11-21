import { Ability, Entity, Item, TrackingProjectile } from "wrapper/Imports"
import { AbilityHelper } from "./AbilityHelper"

export class ItemsHelper extends AbilityHelper {
	public get Tick() {
		return 100
	}
	// maybe is bad work
	public ProjectileDelay(proj_name: string, item: Item, ProjList: TrackingProjectile[], ability: Ability | Item): number {
		let Projectile = ProjList.find(x => x.TargetLoc.Distance(x.Position) < x.Speed / 30 * 2 && x.ParticlePath === proj_name)
		if (Projectile !== undefined && item !== undefined)
			return (this.unit.Distance2D(Projectile.Target as Entity) / Projectile.Speed * 1000) - this.CastDelay(ability)
		return 0
	}
}
