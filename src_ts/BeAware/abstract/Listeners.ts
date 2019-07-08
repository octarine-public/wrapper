import { Entity, EventsSDK, Unit} from "wrapper/Imports"
import { State } from "../Module/TreantMapHack/Menu"
import * as Treant from "../Module/TreantMapHack/Particle"
import { stateMain } from "./Menu.Base"
export let NPC: Unit[] = []
EventsSDK.on("EntityCreated", (ent: Entity, index: number) => {
	if (!stateMain.value || ent === undefined || index === undefined)
		return
	if (State.value){
		Treant.Create(ent, index)
	}
})
EventsSDK.on("EntityDestroyed", (ent: Entity, index: number) => {
	if (!stateMain.value || ent === undefined || index === undefined)
		return
	if (State.value){
		Treant.Destroy(ent, index)
	}
})