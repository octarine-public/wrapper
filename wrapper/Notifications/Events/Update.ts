import Events from "../../Managers/Events"
import EventsSDK from "../../Managers/EventsSDK"
import UserCmd from "../../Native/UserCmd"

export let IsShopOpen = false
Events.on("Update", () => {
	const cmd = new UserCmd()
	IsShopOpen = cmd.ShopMask === 13
})

EventsSDK.on("GameEnded", () => {
	IsShopOpen = false
})
