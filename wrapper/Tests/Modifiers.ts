import { EventsSDK } from "../Managers/EventsSDK"
import { IModifier } from "../Managers/ModifierManager"
import { ModifierSDKClass } from "../Objects/NativeToSDK"

// Test special values
EventsSDK.on("UnitAbilityDataUpdated", () => {
	if (!((globalThis as any)?.DEBUGGER_INSTALLED ?? false)) {
		return
	}
	const allClasses = [...ModifierSDKClass.values()]
	for (let i = allClasses.length - 1; i > -1; i--) {
		const fakeKV = new IModifier(new Map())
		new allClasses[i](fakeKV).TestSpecialValue()
	}
})
