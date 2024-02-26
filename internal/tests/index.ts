// import { Menu } from "../../wrapper/Imports"

// class Test {
// 	public Primary = -1
// 	public Secondary = -1

// 	public Stack = false

// 	constructor(index: number, index2: number) {
// 		this.Primary = index
// 		this.Secondary = index2
// 	}

// 	public get Name() {
// 		return `Primary: ${this.Primary} Secondary: ${this.Secondary}`
// 	}
// }

// class Test2 {
// 	public Primary = -1
// 	public Secondary = -1
// 	constructor(index: number, index2: number) {
// 		this.Primary = index
// 		this.Secondary = index2
// 	}
// }

// const arr = [...new Array(100_000).keys()]
// const arr2 = [...new Array(100_000).keys()]
// const arr3 = [...new Array(100_000).keys()]

// const arr: Test[] = []
// const arr2: Test[] = []
// const arr3: Test[] = []

// for (let i = 0, end = 10_000; i < end; i++) {
// 	arr.push(new Test(i, i))
// 	arr2.push(new Test(i, i))
// 	arr3.push(new Test(i, i))
// }

// const menu = Menu.AddEntry("Test")
// menu.SortNodes = false

// const key = menu.AddKeybind("Test by array")
// const key2 = menu.AddKeybind("Test callback array")
// const key3 = menu.AddKeybind("Test reduce array")
// // const key3 = menu.AddKeybind("Test pop")

// key.OnRelease(call => {
// 	const start = hrtime()
// 	let total = 0
// 	const names = new Set<string>()
// 	for (let index = arr.length - 1; index > -1; index--) {
// 		const modifier = arr[index]
// 		if (!modifier.Primary) {
// 			continue
// 		}
// 		if (modifier.Stack && names.has(modifier.Name)) {
// 			continue
// 		}
// 		total += modifier.Primary
// 	}
// 	console.log(call.InternalName, hrtime() - start, total)
// })

// // slow
// function calculateByСallback(
// 	names: Set<string>,
// 	skipped: (buff: Test) => boolean,
// 	value: (buff: Test) => number,
// 	isAmp = false
// ) {
// 	let totalBonus = isAmp ? 1 : 0
// 	for (let index = arr2.length - 1; index > -1; index--) {
// 		const buff = arr2[index]
// 		if (skipped(buff)) {
// 			continue
// 		}
// 		names.add(buff.Name)
// 		totalBonus += value(buff)
// 	}
// 	return totalBonus
// }

// key2.OnRelease(call => {
// 	const start = hrtime()
// 	const names = new Set<string>()
// 	const newVal = calculateByСallback(
// 		names,
// 		modifier => !modifier.Primary || (modifier.Stack && names.has(modifier.Name)),
// 		modifier => modifier.Primary
// 	)
// 	console.log(call.InternalName, hrtime() - start, newVal)
// })

// key3.OnRelease(call => {
// 	const start = hrtime()
// 	const names = new Set<string>()
// 	const newVal = arr3.reduce((val, el) => {
// 		if (!el.Primary) {
// 			return val
// 		}
// 		if (el.Stack && names.has(el.Name)) {
// 			return val
// 		}
// 		names.add(el.Name)
// 		return val + el.Primary
// 	}, 0)
// 	console.log(call.InternalName, hrtime() - start, newVal)
// })

// key3.OnRelease(() => {
// 	const start = hrtime()
// 	while (arr3.length > 0) {
// 		arr3.pop()
// 	}
// 	console.log(key3.InternalName, hrtime() - start)
// })

// EventsSDK.on("PostDataUpdate", () => {
// 	/** @todo */
// })
