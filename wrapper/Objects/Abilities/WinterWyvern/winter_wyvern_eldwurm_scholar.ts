import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("winter_wyvern_eldwurm_scholar")
export class winter_wyvern_eldwurm_scholar extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
