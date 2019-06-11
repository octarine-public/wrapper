import { EventsSDK, Vector3, Unit, Creep, Tower, ArrayExtensions } from "../../CrutchesSDK/Imports";
import { baseCheckUnit } from "../modules/Controllables";


// --- Variables

export let allNPCs: Unit[] = [];
export let allCreeps: Creep[] = [];
export let allTowers: Tower[] = [];

// --- Methods
EventsSDK.on("onEntityCreated", ent => {
	
	if (ent instanceof Creep && ent.IsLaneCreep && ent.IsAlly())
		allCreeps.push(ent);
	
	else if (ent instanceof Tower)
		allTowers.push(ent);
	
	else if (ent instanceof Unit && baseCheckUnit(ent))
		allNPCs.push(ent);
});

EventsSDK.on("onEntityDestroyed", ent => {
	
	if (ent instanceof Creep)
		ArrayExtensions.arrayRemove(allCreeps, ent);

	else if (ent instanceof Tower)
		ArrayExtensions.arrayRemove(allTowers, ent);
	
	else if (ent instanceof Unit)
		ArrayExtensions.arrayRemove(allNPCs, ent);
});