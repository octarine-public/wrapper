import { Unit } from "wrapper/Imports"
import { IMenuParticlePicker, IMenuColorPicker } from "wrapper/Menu/ITypes"

import { IBuildingPattern } from "../modules/Towers/Menu"


export function ParticleUpdatePattern(
	style: IMenuParticlePicker | IMenuColorPicker,
	updateCallback: () => void,
	restartCallback: () => void) {

	style.R.OnValue(updateCallback)
	style.G.OnValue(updateCallback)
	style.B.OnValue(updateCallback)
	style.A.OnValue(updateCallback);

	(style as IMenuParticlePicker).Width?.OnValue(updateCallback);
	(style as IMenuParticlePicker).Style?.OnValue(restartCallback)
}

export let MenuCheckTeam = (pattern: IBuildingPattern, ent: Unit) => (
	!pattern.State.value
	|| (pattern.Team.selected_id === 1 && !ent.IsEnemy())
	|| (pattern.Team.selected_id === 2 && ent.IsEnemy())
)