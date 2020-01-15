import { EventsSDK } from "wrapper/Imports"
import { stateMain } from "./base/MenuBase"
import { Modules } from "./base/RegisterModule"


const OnState = (state: boolean) => Modules.forEach(module => module.OnState(state))

stateMain.OnValue(self => OnState(self.value))

EventsSDK.on("EntityCreated", ent => stateMain.value
	&& Modules.forEach(module => module.EntityCreated?.(ent)))
EventsSDK.on("EntityDestroyed", ent => Modules.forEach(module => module.EntityDestroyed?.(ent)))

EventsSDK.on("GameStarted", () => stateMain.value
	&& Modules.forEach(module => module.OnState(true)))
EventsSDK.on("GameEnded", () => Modules.forEach(module => module.OnState(false)))

EventsSDK.on("Draw", () => Modules.forEach(module => module.Draw?.()))