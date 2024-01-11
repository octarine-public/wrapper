import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { Unit } from "../Objects/Base/Unit"
import { EventEmitter, Events } from "./Events"

const keysDown = new Map<VKeys, boolean>()
const mouseDown = new Map<VMouseKeys, boolean>()

export const InputEventSDK: InputEventSDK = new EventEmitter()

const lodword = (dw: bigint) => Number(dw & 0xffffn)
const hidword = (dw: bigint) => Number((dw >> 16n) & 0xffffn)

const xMouseKey = (wParam: bigint) =>
	hidword(wParam) === VXMouseKeys.XBUTTON1
		? VMouseKeys.MK_XBUTTON1
		: VMouseKeys.MK_XBUTTON2

export const InputManager = new (class CInputManager {
	public IsShopOpen = false
	public IsScoreboardOpen = false
	public readonly SelectedEntities: Unit[] = []
	public QueryUnit: Nullable<Unit>
	public SelectedUnit: Nullable<Unit>
	private CursorOnWorld_ = new Vector3()
	private x = 0
	private y = 0

	public get CursorOnWorld(): Vector3 {
		return this.CursorOnWorld_.Clone()
	}
	public set CursorOnWorld(vec: Vector3) {
		this.CursorOnWorld_.CopyFrom(vec)
	}
	public get CursorOnScreen(): Vector2 {
		return new Vector2(this.x, this.y)
	}
	public IsKeyDown(key: VKeys): boolean {
		return keysDown.get(key) === true
	}
	public IsMouseKeyDown(key: VMouseKeys): boolean {
		return mouseDown.get(key) === true
	}
	public UpdateCursorOnScreen(x?: number, y?: number) {
		if (x === undefined || y === undefined) {
			x = CursorPosition[0]
			y = CursorPosition[1]
		}
		this.x = x
		this.y = y
	}
})()

Events.on("WndProc", (msg, wParam, _lParam, x, y) => {
	InputManager.UpdateCursorOnScreen(x, y)
	let mKey = 0
	switch (msg) {
		case InputMessage.WM_LBUTTONUP:
		case InputMessage.WM_LBUTTONDOWN:
		case InputMessage.WM_LBUTTONDBLCLK:
			mKey = VMouseKeys.MK_LBUTTON
			break
		case InputMessage.WM_RBUTTONUP:
		case InputMessage.WM_RBUTTONDOWN:
		case InputMessage.WM_RBUTTONDBLCLK:
			mKey = VMouseKeys.MK_RBUTTON
			break
		case InputMessage.WM_MBUTTONUP:
		case InputMessage.WM_MBUTTONDOWN:
		case InputMessage.WM_MBUTTONDBLCLK:
			mKey = VMouseKeys.MK_MBUTTON
			break
		case InputMessage.WM_XBUTTONUP:
		case InputMessage.WM_XBUTTONDOWN:
		case InputMessage.WM_XBUTTONDBLCLK:
			mKey = xMouseKey(wParam)
			break
	}

	switch (msg) {
		case InputMessage.WM_KEYDOWN:
		case InputMessage.WM_SYSKEYDOWN:
			if (wParam < 256) {
				keysDown.set(lodword(wParam), true)
				return InputEventSDK.emit("KeyDown", true, lodword(wParam))
			}
			break

		case InputMessage.WM_KEYUP:
		case InputMessage.WM_SYSKEYUP:
			keysDown.delete(lodword(wParam))
			return InputEventSDK.emit("KeyUp", true, lodword(wParam))

		case InputMessage.WM_LBUTTONDOWN:
		case InputMessage.WM_LBUTTONDBLCLK:
		case InputMessage.WM_RBUTTONDOWN:
		case InputMessage.WM_RBUTTONDBLCLK:
		case InputMessage.WM_MBUTTONDOWN:
		case InputMessage.WM_MBUTTONDBLCLK:
		case InputMessage.WM_XBUTTONDOWN:
		case InputMessage.WM_XBUTTONDBLCLK:
			mouseDown.set(mKey, true)
			return InputEventSDK.emit("MouseKeyDown", true, mKey)

		case InputMessage.WM_LBUTTONUP:
		case InputMessage.WM_RBUTTONUP:
		case InputMessage.WM_MBUTTONUP:
		case InputMessage.WM_XBUTTONUP:
			mouseDown.delete(mKey)
			return InputEventSDK.emit("MouseKeyUp", true, mKey)

		case InputMessage.WM_MOUSEWHEEL:
			return InputEventSDK.emit("MouseWheel", true, hidword(wParam).toInt16 > 0)

		default:
			break
	}

	return true
})

export const enum InputMessage {
	WM_NULL = 0x0000,
	WM_CREATE = 0x0001,
	WM_DESTROY = 0x0002,
	WM_MOVE = 0x0003,
	WM_SIZE = 0x0005,
	WM_ACTIVATE = 0x0006,
	WM_SETFOCUS = 0x0007,
	WM_KILLFOCUS = 0x0008,
	WM_ENABLE = 0x000a,
	WM_SETREDRAW = 0x000b,
	WM_SETTEXT = 0x000c,
	WM_GETTEXT = 0x000d,
	WM_GETTEXTLENGTH = 0x000e,
	WM_PAINT = 0x000f,
	WM_CLOSE = 0x0010,
	WM_QUERYENDSESSION = 0x0011,
	WM_QUERYOPEN = 0x0013,
	WM_ENDSESSION = 0x0016,
	WM_QUIT = 0x0012,
	WM_ERASEBKGND = 0x0014,
	WM_SYSCOLORCHANGE = 0x0015,
	WM_SHOWWINDOW = 0x0018,
	WM_WININICHANGE = 0x001a,
	WM_SETTINGCHANGE = WM_WININICHANGE,
	WM_DEVMODECHANGE = 0x001b,
	WM_ACTIVATEAPP = 0x001c,
	WM_FONTCHANGE = 0x001d,
	WM_TIMECHANGE = 0x001e,
	WM_CANCELMODE = 0x001f,
	WM_SETCURSOR = 0x0020,
	WM_MOUSEACTIVATE = 0x0021,
	WM_CHILDACTIVATE = 0x0022,
	WM_QUEUESYNC = 0x0023,
	WM_GETMINMAXINFO = 0x0024,
	WM_PAINTICON = 0x0026,
	WM_ICONERASEBKGND = 0x0027,
	WM_NEXTDLGCTL = 0x0028,
	WM_SPOOLERSTATUS = 0x002a,
	WM_DRAWITEM = 0x002b,
	WM_MEASUREITEM = 0x002c,
	WM_DELETEITEM = 0x002d,
	WM_VKEYTOITEM = 0x002e,
	WM_CHARTOITEM = 0x002f,
	WM_SETFONT = 0x0030,
	WM_GETFONT = 0x0031,
	WM_SETHOTKEY = 0x0032,
	WM_GETHOTKEY = 0x0033,
	WM_QUERYDRAGICON = 0x0037,
	WM_COMPAREITEM = 0x0039,
	WM_GETOBJECT = 0x003d,
	WM_COMPACTING = 0x0041,
	WM_COMMNOTIFY = 0x0044,
	WM_WINDOWPOSCHANGING = 0x0046,
	WM_WINDOWPOSCHANGED = 0x0047,
	WM_POWER = 0x0048,
	WM_COPYDATA = 0x004a,
	WM_CANCELJOURNAL = 0x004b,
	WM_NOTIFY = 0x004e,
	WM_INPUTLANGCHANGEREQUEST = 0x0050,
	WM_INPUTLANGCHANGE = 0x0051,
	WM_TCARD = 0x0052,
	WM_HELP = 0x0053,
	WM_USERCHANGED = 0x0054,
	WM_NOTIFYFORMAT = 0x0055,
	WM_CONTEXTMENU = 0x007b,
	WM_STYLECHANGING = 0x007c,
	WM_STYLECHANGED = 0x007d,
	WM_DISPLAYCHANGE = 0x007e,
	WM_GETICON = 0x007f,
	WM_SETICON = 0x0080,
	WM_NCCREATE = 0x0081,
	WM_NCDESTROY = 0x0082,
	WM_NCCALCSIZE = 0x0083,
	WM_NCHITTEST = 0x0084,
	WM_NCPAINT = 0x0085,
	WM_NCACTIVATE = 0x0086,
	WM_GETDLGCODE = 0x0087,
	WM_SYNCPAINT = 0x0088,

	WM_NCMOUSEMOVE = 0x00a0,
	WM_NCLBUTTONDOWN = 0x00a1,
	WM_NCLBUTTONUP = 0x00a2,
	WM_NCLBUTTONDBLCLK = 0x00a3,
	WM_NCRBUTTONDOWN = 0x00a4,
	WM_NCRBUTTONUP = 0x00a5,
	WM_NCRBUTTONDBLCLK = 0x00a6,
	WM_NCMBUTTONDOWN = 0x00a7,
	WM_NCMBUTTONUP = 0x00a8,
	WM_NCMBUTTONDBLCLK = 0x00a9,
	WM_NCXBUTTONDOWN = 0x00ab,
	WM_NCXBUTTONUP = 0x00ac,
	WM_NCXBUTTONDBLCLK = 0x00ad,

	WM_INPUT_DEVICE_CHANGE = 0x00fe,
	WM_INPUT = 0x00ff,

	WM_KEYFIRST = 0x0100,
	WM_KEYDOWN = 0x0100,
	WM_KEYUP = 0x0101,
	WM_CHAR = 0x0102,
	WM_DEADCHAR = 0x0103,
	WM_SYSKEYDOWN = 0x0104,
	WM_SYSKEYUP = 0x0105,
	WM_SYSCHAR = 0x0106,
	WM_SYSDEADCHAR = 0x0107,
	WM_UNICHAR = 0x0109,
	WM_KEYLAST = 0x0109,

	WM_IME_STARTCOMPOSITION = 0x010d,
	WM_IME_ENDCOMPOSITION = 0x010e,
	WM_IME_COMPOSITION = 0x010f,
	WM_IME_KEYLAST = 0x010f,

	WM_INITDIALOG = 0x0110,
	WM_COMMAND = 0x0111,
	WM_SYSCOMMAND = 0x0112,
	WM_TIMER = 0x0113,
	WM_HSCROLL = 0x0114,
	WM_VSCROLL = 0x0115,
	WM_INITMENU = 0x0116,
	WM_INITMENUPOPUP = 0x0117,
	WM_MENUSELECT = 0x011f,
	WM_MENUCHAR = 0x0120,
	WM_ENTERIDLE = 0x0121,
	WM_MENURBUTTONUP = 0x0122,
	WM_MENUDRAG = 0x0123,
	WM_MENUGETOBJECT = 0x0124,
	WM_UNINITMENUPOPUP = 0x0125,
	WM_MENUCOMMAND = 0x0126,

	WM_CHANGEUISTATE = 0x0127,
	WM_UPDATEUISTATE = 0x0128,
	WM_QUERYUISTATE = 0x0129,

	WM_CTLCOLORMSGBOX = 0x0132,
	WM_CTLCOLOREDIT = 0x0133,
	WM_CTLCOLORLISTBOX = 0x0134,
	WM_CTLCOLORBTN = 0x0135,
	WM_CTLCOLORDLG = 0x0136,
	WM_CTLCOLORSCROLLBAR = 0x0137,
	WM_CTLCOLORSTATIC = 0x0138,
	MN_GETHMENU = 0x01e1,

	WM_MOUSEFIRST = 0x0200,
	WM_MOUSEMOVE = 0x0200,
	WM_LBUTTONDOWN = 0x0201,
	WM_LBUTTONUP = 0x0202,
	WM_LBUTTONDBLCLK = 0x0203,
	WM_RBUTTONDOWN = 0x0204,
	WM_RBUTTONUP = 0x0205,
	WM_RBUTTONDBLCLK = 0x0206,
	WM_MBUTTONDOWN = 0x0207,
	WM_MBUTTONUP = 0x0208,
	WM_MBUTTONDBLCLK = 0x0209,
	WM_MOUSEWHEEL = 0x020a,
	WM_XBUTTONDOWN = 0x020b,
	WM_XBUTTONUP = 0x020c,
	WM_XBUTTONDBLCLK = 0x020d,
	WM_MOUSEHWHEEL = 0x020e,

	WM_PARENTNOTIFY = 0x0210,
	WM_ENTERMENULOOP = 0x0211,
	WM_EXITMENULOOP = 0x0212,

	WM_NEXTMENU = 0x0213,
	WM_SIZING = 0x0214,
	WM_CAPTURECHANGED = 0x0215,
	WM_MOVING = 0x0216,

	WM_POWERBROADCAST = 0x0218,

	WM_DEVICECHANGE = 0x0219,

	WM_MDICREATE = 0x0220,
	WM_MDIDESTROY = 0x0221,
	WM_MDIACTIVATE = 0x0222,
	WM_MDIRESTORE = 0x0223,
	WM_MDINEXT = 0x0224,
	WM_MDIMAXIMIZE = 0x0225,
	WM_MDITILE = 0x0226,
	WM_MDICASCADE = 0x0227,
	WM_MDIICONARRANGE = 0x0228,
	WM_MDIGETACTIVE = 0x0229,

	WM_MDISETMENU = 0x0230,
	WM_ENTERSIZEMOVE = 0x0231,
	WM_EXITSIZEMOVE = 0x0232,
	WM_DROPFILES = 0x0233,
	WM_MDIREFRESHMENU = 0x0234,

	WM_IME_SETCONTEXT = 0x0281,
	WM_IME_NOTIFY = 0x0282,
	WM_IME_CONTROL = 0x0283,
	WM_IME_COMPOSITIONFULL = 0x0284,
	WM_IME_SELECT = 0x0285,
	WM_IME_CHAR = 0x0286,
	WM_IME_REQUEST = 0x0288,
	WM_IME_KEYDOWN = 0x0290,
	WM_IME_KEYUP = 0x0291,

	WM_MOUSEHOVER = 0x02a1,
	WM_MOUSELEAVE = 0x02a3,
	WM_NCMOUSEHOVER = 0x02a0,
	WM_NCMOUSELEAVE = 0x02a2,

	WM_WTSSESSION_CHANGE = 0x02b1,

	WM_TABLET_FIRST = 0x02c0,
	WM_TABLET_LAST = 0x02df,

	WM_CUT = 0x0300,
	WM_COPY = 0x0301,
	WM_PASTE = 0x0302,
	WM_CLEAR = 0x0303,
	WM_UNDO = 0x0304,
	WM_RENDERFORMAT = 0x0305,
	WM_RENDERALLFORMATS = 0x0306,
	WM_DESTROYCLIPBOARD = 0x0307,
	WM_DRAWCLIPBOARD = 0x0308,
	WM_PAINTCLIPBOARD = 0x0309,
	WM_VSCROLLCLIPBOARD = 0x030a,
	WM_SIZECLIPBOARD = 0x030b,
	WM_ASKCBFORMATNAME = 0x030c,
	WM_CHANGECBCHAIN = 0x030d,
	WM_HSCROLLCLIPBOARD = 0x030e,
	WM_QUERYNEWPALETTE = 0x030f,
	WM_PALETTEISCHANGING = 0x0310,
	WM_PALETTECHANGED = 0x0311,
	WM_HOTKEY = 0x0312,

	WM_PRINT = 0x0317,
	WM_PRINTCLIENT = 0x0318,

	WM_APPCOMMAND = 0x0319,

	WM_THEMECHANGED = 0x031a,

	WM_CLIPBOARDUPDATE = 0x031d,

	WM_DWMCOMPOSITIONCHANGED = 0x031e,
	WM_DWMNCRENDERINGCHANGED = 0x031f,
	WM_DWMCOLORIZATIONCOLORCHANGED = 0x0320,
	WM_DWMWINDOWMAXIMIZEDCHANGE = 0x0321,

	WM_GETTITLEBARINFOEX = 0x033f,

	WM_HANDHELDFIRST = 0x0358,
	WM_HANDHELDLAST = 0x035f,

	WM_AFXFIRST = 0x0360,
	WM_AFXLAST = 0x037f,

	WM_PENWINFIRST = 0x0380,
	WM_PENWINLAST = 0x038f,

	WM_APP = 0x8000,

	WM_USER = 0x0400,

	WM_REFLECT = WM_USER + 0x1c00
}

export enum VKeys {
	LBUTTON = 0x01,
	RBUTTON = 0x02,
	CANCEL = 0x03,
	MBUTTON = 0x04,
	XBUTTON1 = 0x05,
	XBUTTON2 = 0x06,
	// 0x07 - Undefined.
	BACK = 0x08,
	TAB = 0x09,
	// 0x0A-0x0B - Reserved.
	CLEAR = 0x0c,
	RETURN = 0x0d,
	// 0x0E-0x0F - Undefined.
	SHIFT = 0x10,
	CONTROL = 0x11,
	MENU = 0x12,
	PAUSE = 0x13,
	CAPITAL = 0x14,
	KANA = 0x15,
	HANGUL = 0x15,
	// 0x16 - Undefined
	JUNJA = 0x17,
	FINAL = 0x18,
	HANJA = 0x19,
	KANJI = 0x19,
	// 0x1A - Undefined.
	ESCAPE = 0x1b,
	CONVERT = 0x1c,
	NONCONVERT = 0x1d,
	ACCEPT = 0x1e,
	MODECHANGE = 0x1f,
	SPACE = 0x20,
	PRIOR = 0x21,
	NEXT = 0x22,
	END = 0x23,
	HOME = 0x24,
	LEFT = 0x25,
	UP = 0x26,
	RIGHT = 0x27,
	DOWN = 0x28,
	SELECT = 0x29,
	PRINT = 0x2a,
	EXECUTE = 0x2b,
	SNAPSHOT = 0x2c,
	INSERT = 0x2d,
	DELETE = 0x2e,
	HELP = 0x2f,
	KEY_0 = 0x30,
	KEY_1 = 0x31,
	KEY_2 = 0x32,
	KEY_3 = 0x33,
	KEY_4 = 0x34,
	KEY_5 = 0x35,
	KEY_6 = 0x36,
	KEY_7 = 0x37,
	KEY_8 = 0x38,
	KEY_9 = 0x39,
	// 0x3A-0x40 - Undefined.
	KEY_A = 0x41,
	KEY_B = 0x42,
	KEY_C = 0x43,
	KEY_D = 0x44,
	KEY_E = 0x45,
	KEY_F = 0x46,
	KEY_G = 0x47,
	KEY_H = 0x48,
	KEY_I = 0x49,
	KEY_J = 0x4a,
	KEY_K = 0x4b,
	KEY_L = 0x4c,
	KEY_M = 0x4d,
	KEY_N = 0x4e,
	KEY_O = 0x4f,
	KEY_P = 0x50,
	KEY_Q = 0x51,
	KEY_R = 0x52,
	KEY_S = 0x53,
	KEY_T = 0x54,
	KEY_U = 0x55,
	KEY_V = 0x56,
	KEY_W = 0x57,
	KEY_X = 0x58,
	KEY_Y = 0x59,
	KEY_Z = 0x5a,
	LWIN = 0x5b,
	RWIN = 0x5c,
	APPS = 0x5d,
	// 0x5E - Reserved.
	SLEEP = 0x5f,
	NUMPAD0 = 0x60,
	NUMPAD1 = 0x61,
	NUMPAD2 = 0x62,
	NUMPAD3 = 0x63,
	NUMPAD4 = 0x64,
	NUMPAD5 = 0x65,
	NUMPAD6 = 0x66,
	NUMPAD7 = 0x67,
	NUMPAD8 = 0x68,
	NUMPAD9 = 0x69,
	MULTIPLY = 0x6a,
	ADD = 0x6b,
	SEPARATOR = 0x6c,
	SUBTRACT = 0x6d,
	DECIMAL = 0x6e,
	DIVIDE = 0x6f,
	F1 = 0x70,
	F2 = 0x71,
	F3 = 0x72,
	F4 = 0x73,
	F5 = 0x74,
	F6 = 0x75,
	F7 = 0x76,
	F8 = 0x77,
	F9 = 0x78,
	F10 = 0x79,
	F11 = 0x7a,
	F12 = 0x7b,
	F13 = 0x7c,
	F14 = 0x7d,
	F15 = 0x7e,
	F16 = 0x7f,
	F17 = 0x80,
	F18 = 0x81,
	F19 = 0x82,
	F20 = 0x83,
	F21 = 0x84,
	F22 = 0x85,
	F23 = 0x86,
	F24 = 0x87,
	// 0x88-0X8F - Unassigned.
	NUMLOCK = 0x90,
	SCROLL = 0x91,
	// 0x92-0x96 - OEM specific.
	// 0x97-0x9F - Unassigned.
	LSHIFT = 0xa0,
	RSHIFT = 0xa1,
	LCONTROL = 0xa2,
	RCONTROL = 0xa3,
	LMENU = 0xa4,
	RMENU = 0xa5,
	BROWSER_BACK = 0xa6,
	BROWSER_FORWARD = 0xa7,
	BROWSER_REFRESH = 0xa8,
	BROWSER_STOP = 0xa9,
	BROWSER_SEARCH = 0xaa,
	BROWSER_FAVORITES = 0xab,
	BROWSER_HOME = 0xac,
	VOLUME_MUTE = 0xad,
	VOLUME_DOWN = 0xae,
	VOLUME_UP = 0xaf,
	MEDIA_NEXT_TRACK = 0xb0,
	MEDIA_PREV_TRACK = 0xb1,
	MEDIA_STOP = 0xb2,
	MEDIA_PLAY_PAUSE = 0xb3,
	LAUNCH_MAIL = 0xb4,
	LAUNCH_MEDIA_SELECT = 0xb5,
	LAUNCH_APP1 = 0xb6,
	LAUNCH_APP2 = 0xb7,
	// 0xB8-0xB9 - Reserved.
	OEM_1 = 0xba,
	OEM_PLUS = 0xbb,
	OEM_COMMA = 0xbc,
	OEM_MINUS = 0xbd,
	OEM_PERIOD = 0xbe,
	OEM_2 = 0xbf,
	TILDE = 0xc0,
	// 0xC1-0xD7 - Reserved.
	// 0xD8-0xDA - Unassigned.
	OEM_4 = 0xdb,
	OEM_5 = 0xdc,
	OEM_6 = 0xdd,
	OEM_7 = 0xde,
	OEM_8 = 0xdf,
	// 0xE0 -  Reserved.
	// 0xE1 - OEM specific.
	OEM_102 = 0xe2,
	// 0xE3-E4 - OEM specific.
	PROCESSKEY = 0xe5,
	// 0xE6 - OEM specific.
	PACKET = 0xe7,
	// 0xE8 - Unassigned.
	// 0xE9-F5 - OEM specific.
	ATTN = 0xf6,
	CRSEL = 0xf7,
	EXSEL = 0xf8,
	EREOF = 0xf9,
	PLAY = 0xfa,
	ZOOM = 0xfb,
	NONAME = 0xfc,
	PA1 = 0xfd,
	OEM_CLEAR = 0xfe
}

export enum VMouseKeys {
	MK_LBUTTON = 0x01,
	MK_RBUTTON = 0x02,
	MK_SHIFT = 0x04,
	MK_CONTROL = 0x08,
	MK_MBUTTON = 0x10,
	MK_XBUTTON1 = 0x20,
	MK_XBUTTON2 = 0x40
}

export enum VXMouseKeys {
	XBUTTON1 = 0x01,
	XBUTTON2 = 0x02
}

interface InputEventSDK extends EventEmitter {
	/**
	 * Emitted when any key on keyboard will be pressed
	 *
	 * @param callback returns keyMask. You can use HasMask from Utils
	 */
	on(name: "KeyDown", callback: (keyMask: VKeys) => boolean | any): EventEmitter
	/**
	 * Emitted when any key on keyboard will be relesead
	 *
	 * @param callback returns keyMask. You can use HasMask from Utils
	 */
	on(name: "KeyUp", callback: (keyMask: VKeys) => boolean | any): EventEmitter
	on(name: "MouseKeyDown", callback: (key: VMouseKeys) => boolean | any): EventEmitter
	on(name: "MouseKeyUp", callback: (key: VMouseKeys) => boolean | any): EventEmitter
	on(name: "MouseWheel", callback: (up: boolean) => boolean | any): EventEmitter
}
