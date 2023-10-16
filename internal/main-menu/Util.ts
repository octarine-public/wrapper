export const enum InternalLanguageID {
	english,
	russian,
	chinese
}

export const internalUtil = new (class {
	public readonly CameraIcon = "menu/icons/camera.svg"
	public readonly ReloadIcon = "menu/icons/reload.svg"
	public readonly ChangerIcon = "menu/icons/changer.svg"
	public readonly NotificationIcon = "menu/icons/notification.svg"

	public SetConVar(name: string, newState: number | boolean): void {
		const oldState = ConVars.Get(name)
		if (oldState !== newState) {
			ConVars.Set(name, newState)
		}
	}
})()
