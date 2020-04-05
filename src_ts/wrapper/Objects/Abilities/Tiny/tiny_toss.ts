import Ability from "../../Base/Ability"

export default class tiny_toss extends Ability {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_toss", tiny_toss)
