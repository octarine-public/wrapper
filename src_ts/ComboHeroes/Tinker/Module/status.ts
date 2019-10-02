import { Base } from "../Extends/Helper"
import { MyHero } from "../../SkywrathMage/Listeners"
let stat:number = 0
export function TinkerStatus(num?: number)
{
	if (num !== undefined) stat = num
	return stat
}
export function TinkerStatusText()
{
	if (TinkerStatus()==2)
		return "push"
	if (TinkerStatus()==0)
		return "combo"
	if (TinkerStatus()==1)
		return "spam"
	return "idle"
}