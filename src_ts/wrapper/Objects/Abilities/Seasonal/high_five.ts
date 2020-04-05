import Ability from "../../Base/Ability"

export default class high_five extends Ability {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("high_five", high_five)
