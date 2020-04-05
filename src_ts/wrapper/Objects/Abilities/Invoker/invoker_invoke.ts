import Ability from "../../Base/Ability"

export default class invoker_invoke extends Ability {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_invoke", invoker_invoke)
