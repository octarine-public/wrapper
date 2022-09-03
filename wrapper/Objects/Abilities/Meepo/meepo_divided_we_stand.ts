import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import EntityManager from "../../../Managers/EntityManager"
import EventsSDK from "../../../Managers/EventsSDK"
import Ability from "../../Base/Ability"
import Unit from "../../Base/Unit"

@WrapperClass("meepo_divided_we_stand")
export default class meepo_divided_we_stand extends Ability {
	@NetworkedBasicField("m_nWhichDividedWeStand")
	public WhichDividedWeStand = -1
	@NetworkedBasicField("m_nNumDividedWeStand")
	public NumDividedWeStand = -1
	@NetworkedBasicField("m_entPrimeDividedWeStand")
	public PrimeDividedWeStand_ = 0
	@NetworkedBasicField("m_entNextDividedWeStand")
	public NextDividedWeStand_ = 0

	public get PrimeDividedWeStand(): Nullable<meepo_divided_we_stand> {
		return EntityManager.EntityByIndex(this.PrimeDividedWeStand_) as Nullable<meepo_divided_we_stand>
	}
	public get NextDividedWeStand(): Nullable<meepo_divided_we_stand> {
		return EntityManager.EntityByIndex(this.NextDividedWeStand_) as Nullable<meepo_divided_we_stand>
	}
}

let isInMeepoCrutch = false
EventsSDK.on("LifeStateChanged", async ent => {
	if (isInMeepoCrutch || !(ent instanceof Unit))
		return
	let abil = ent.GetAbilityByClass(meepo_divided_we_stand)
	if (abil === undefined)
		return
	abil = abil.PrimeDividedWeStand
	while (abil !== undefined) {
		if (abil.Owner !== undefined && !abil.Owner.IsVisible) {
			abil.Owner.LifeState = ent.LifeState
			isInMeepoCrutch = true
			await EventsSDK.emit("LifeStateChanged", false, abil.Owner)
			isInMeepoCrutch = false
		}
		abil = abil.NextDividedWeStand
	}
})
