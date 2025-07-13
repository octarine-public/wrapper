import { WrapperClass, WrapperClassNetworkParticle } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_ultimate_scepter")
@WrapperClassNetworkParticle({
	Attachs: 1,
	IsAttachedTo: true,
	Paths: "particles/items4_fx/scepter_aura.vpcf"
})
export class item_ultimate_scepter extends Item {}
