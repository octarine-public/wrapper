import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("rattletrap_rocket_flare")
@WrapperClassNetworkParticle({
	Attachs: 2,
	IsModifiersAttachedTo: true,
	Paths: [
		"particles/units/heroes/hero_rattletrap/rattletrap_rocket_flare.vpcf",
		"particles/units/heroes/hero_rattletrap/rattletrap_rocket_flare_illumination.vpcf"
	]
})
export class rattletrap_rocket_flare extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
