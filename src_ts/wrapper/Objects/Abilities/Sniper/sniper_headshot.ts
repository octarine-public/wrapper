import Ability from "../../Base/Ability"

export default class sniper_headshot extends Ability {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sniper_headshot", sniper_headshot)
