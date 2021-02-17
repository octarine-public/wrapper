import EventsSDK from "../../Managers/EventsSDK"
import { DispsoeNotification } from "../data"

EventsSDK.on("GameEnded", () =>
	DispsoeNotification())
