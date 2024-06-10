import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

// k_EDOTATriviaQuestionCategory_InvokerSpells
// trivia_data.txt
@WrapperClass("invoker_alacrity_ad")
export class invoker_alacrity_ad extends Ability {
	@NetworkedBasicField("m_nQuasLevel")
	public QuasLevel = 0
	@NetworkedBasicField("m_nWexLevel")
	public WexLevel = 0
	@NetworkedBasicField("m_nExortLevel")
	public ExortLevel = 0
}
