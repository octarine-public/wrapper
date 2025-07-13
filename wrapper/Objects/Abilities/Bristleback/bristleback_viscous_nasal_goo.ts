import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bristleback_viscous_nasal_goo")
@WrapperClassNetworkParticle({
	Attachs: 1,
	IsModifiersAttachedTo: true,
	Paths: "particles/units/heroes/hero_bristleback/bristleback_viscous_nasal_goo_debuff.vpcf"
})
export class bristleback_viscous_nasal_goo extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack3"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("goo_speed", level)
	}
}
