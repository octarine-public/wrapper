import { Entity, EventsSDK, Unit} from "wrapper/Imports"
import { State } from "../Module/TreantMapHack/Menu"
import * as Treant from "../Module/TreantMapHack/Particle"
import { stateMain } from "./Menu.Base"
import * as TopHud from "../Module/TopHud/Entities"
export let NPC: Unit[] = []
EventsSDK.on("EntityCreated", (ent: Entity, index: number) => {
	if (!stateMain.value || ent === undefined || index === undefined)
		return
	if (State.value){
		Treant.Create(ent, index)
	}
	TopHud.entityCreate(ent)
})
EventsSDK.on("EntityDestroyed", (ent: Entity, index: number) => {
	if (!stateMain.value || ent === undefined || index === undefined)
		return
	if (State.value){
		Treant.Destroy(ent, index)
	}
	TopHud.entityDestroy(ent)
})