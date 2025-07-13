import { WrapperClass, WrapperClassNetworkParticle } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_spider_legs")
@WrapperClassNetworkParticle({
	Attachs: 1,
	IsAttachedTo: true,
	Paths: "particles/items5_fx/spider_legs_buff.vpcf"
})
export class item_spider_legs extends Item {}
