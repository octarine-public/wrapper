import { EventsSDK, Unit, Entity} from "wrapper/Imports";
import { stateMain } from "./Menu.Base";
import { State } from "../Module/TreantMapHack/Menu";
import * as Treant from "../Module/TreantMapHack/Particle";
export let NPC: Unit[] = [];
EventsSDK.on("EntityCreated", (ent: Entity, index: number) => {
	if (!stateMain.value || ent === undefined || index === undefined)
		return;
	if (State.value){
		Treant.Create(ent, index);
	}
});
EventsSDK.on("EntityDestroyed", (ent: Entity, index: number) => {
	if (!stateMain.value || ent === undefined || index === undefined)
		return;
	if (State.value){
		Treant.Destroy(ent, index);
	}
});