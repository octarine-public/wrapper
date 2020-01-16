import { Flow_t } from "wrapper/Imports"

export default class XAIOGame {

	public get Ping(): number { // don't touch, that's right.
		return GetLatency(Flow_t.IN) * 1000
	}
}