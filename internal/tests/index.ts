// import { Menu } from "../../wrapper/Imports"

// // class Test {
// // 	public Primary = -1
// // 	public Secondary = -1
// // 	constructor(index: number, index2: number) {
// // 		this.Primary = index
// // 		this.Secondary = index2
// // 	}
// // }

// /** one */
// // const arr = [
// // 	new Test(1, 2),
// // 	new Test(0, 1),
// // 	new Test(2, 1),
// // 	new Test(2, 0),
// // 	new Test(0, 2),
// // 	new Test(0, 3)
// // ]

// // const arr2 = [
// // 	new Test(1, 2),
// // 	new Test(0, 1),
// // 	new Test(2, 1),
// // 	new Test(2, 0),
// // 	new Test(0, 2),
// // 	new Test(0, 3)
// // ]

// // const arr = [...new Array(100_000).keys()]
// // const arr2 = [...new Array(100_000).keys()]

// const arr = [...new Array(100_000).keys()]
// const arr2 = [...new Array(100_000).keys()]
// const arr3 = [...new Array(100_000).keys()]

// const menu = Menu.AddEntry("Test")
// menu.SortNodes = false

// const key = menu.AddKeybind("Test length")
// const key2 = menu.AddKeybind("Test splice")
// const key3 = menu.AddKeybind("Test pop")

// key.OnRelease(() => {
// 	const start = hrtime()
// 	arr.length = 0
// 	console.log(key.InternalName, hrtime() - start)
// })

// key2.OnRelease(() => {
// 	const start = hrtime()
// 	arr2.splice(0, arr2.length)
// 	console.log(key2.InternalName, hrtime() - start)
// })

// key3.OnRelease(() => {
// 	const start = hrtime()
// 	while (arr3.length > 0) {
// 		arr3.pop()
// 	}
// 	console.log(key3.InternalName, hrtime() - start)
// })
