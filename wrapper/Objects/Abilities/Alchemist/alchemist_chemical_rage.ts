import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("alchemist_chemical_rage")
@WrapperClassNetworkParticle({
	Attachs: 2,
	IsAttachedTo: true,
	Paths: "particles/units/heroes/hero_alchemist/alchemist_chemichalrage_effect.vpcf"
})
export class alchemist_chemical_rage extends Ability {}
