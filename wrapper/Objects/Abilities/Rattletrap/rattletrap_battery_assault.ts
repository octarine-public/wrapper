import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("rattletrap_battery_assault")
@WrapperClassNetworkParticle({
	Attachs: 1,
	IsAttachedTo: true,
	Paths: [
		"particles/units/heroes/hero_rattletrap/rattletrap_battery_assault.vpcf",
		"particles/units/heroes/hero_rattletrap/rattletrap_battery_shrapnel.vpcf"
	]
})
export class rattletrap_battery_assault extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
