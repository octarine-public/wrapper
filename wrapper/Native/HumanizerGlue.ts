let processUserCmd_: Nullable<() => void>
export function SetProcessUserCmd(f: () => void) {
	processUserCmd_ = f
}

export function ProcessUserCmd() {
	if (processUserCmd_ !== undefined) {
		processUserCmd_()
	}
}
