import Ability from "../../Base/Ability"

export default class zuus_static_field extends Ability {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("zuus_static_field", zuus_static_field)
