import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { EntityManager } from "../../../Managers/EntityManager"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("meepo_divided_we_stand")
export class meepo_divided_we_stand extends Ability {
	@NetworkedBasicField("m_nWhichDividedWeStand")
	public WhichDividedWeStand = -1
	@NetworkedBasicField("m_nNumDividedWeStand")
	public NumDividedWeStand = -1
	@NetworkedBasicField("m_entPrimeDividedWeStand")
	public PrimeDividedWeStand_ = 0
	@NetworkedBasicField("m_entNextDividedWeStand")
	public NextDividedWeStand_ = 0

	public get PrimeDividedWeStand() {
		return EntityManager.EntityByIndex<meepo_divided_we_stand>(
			this.PrimeDividedWeStand_
		)
	}
	public get NextDividedWeStand() {
		return EntityManager.EntityByIndex<meepo_divided_we_stand>(
			this.NextDividedWeStand_
		)
	}
}

let isInMeepoCrutch = false
EventsSDK.on("LifeStateChanged", ent => {
	if (isInMeepoCrutch || !(ent instanceof Unit)) {
		return
	}
	let abil = ent.GetAbilityByClass(meepo_divided_we_stand)
	if (abil === undefined) {
		return
	}
	abil = abil.PrimeDividedWeStand
	while (abil !== undefined) {
		if (
			abil.Owner !== undefined &&
			!abil.Owner.IsVisible &&
			abil.Owner.LifeState !== ent.LifeState
		) {
			abil.Owner.LifeState = ent.LifeState
			abil.Owner.HP = ent.IsAlive ? abil.Owner.MaxHP : 0
			isInMeepoCrutch = true
			EventsSDK.emit("LifeStateChanged", false, abil.Owner)
			isInMeepoCrutch = false
		}
		abil = abil.NextDividedWeStand
	}
})
