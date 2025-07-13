import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { EventPriority } from "../../../Enums/EventPriority"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Ability } from "../../Base/Ability"
import { LinearProjectile } from "../../Base/Projectile"
import { Unit } from "../../Base/Unit"

@WrapperClass("clinkz_burning_barrage")
export class clinkz_burning_barrage extends Ability implements INuke {
	public InternaProjectileSpeed = 1200 // no special value

	public IsNuke(): this is INuke {
		return true
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const multiplier = this.GetSpecialValue("damage_pct")
		const attackDamage = owner.GetRawAttackDamage(target)
		return (attackDamage * multiplier) / 100
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		return owner.GetAttackDamage(
			target,
			ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN,
			this.GetRawDamage(target)
		)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("projectile_width", level)
	}
	public GetBaseSpeedForLevel(_level: number): number {
		return this.InternaProjectileSpeed
	}
}

function UpdateProjectileSpeed(proj: LinearProjectile) {
	if (proj.Ability instanceof clinkz_burning_barrage) {
		proj.Speed = proj.Ability.InternaProjectileSpeed
	}
}

EventsSDK.on(
	"LinearProjectileCreated",
	proj => UpdateProjectileSpeed(proj),
	EventPriority.IMMEDIATE
)
