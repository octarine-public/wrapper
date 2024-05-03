let ProcessUserCmd_: Nullable<() => void>
export function SetProcessUserCmd(f: () => void) {
	ProcessUserCmd_ = f
}

export function ProcessUserCmd() {
	if (ProcessUserCmd_ !== undefined) {
		ProcessUserCmd_()
	}
}
