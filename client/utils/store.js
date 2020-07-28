class Store {
	constructor(id) {
		this.id = id
	}

	add(key, value) {
		const dataStoreString = localStorage.getItem(this.id)
		if (dataStoreString === null) {
			localStorage.setItem(this.id, JSON.stringify({
				key: value,
			}))
		} else {
			const dataStore = JSON.parse(dataStoreString)
			const updateStore = {
				...dataStore,
			}
			updateStore[key] = value
			localStorage.setItem(this.id, JSON.parse(updateStore))
		}
	}

	get(key) {
		Store.get(this.id, key)
	}

	static get(id, key) {
		const dataStore = JSON.parse(localStorage.getItem(id))
		return dataStore[key]
	}
}

export {
	Store,
	Store as default,
}
