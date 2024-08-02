// store.js
class Store {
    constructor(initialState) {
        this.state = initialState || {};
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.listeners.forEach(listener => listener(this.state));
    }

    setUserRole(role) {
        this.updateState({ userRole: role });
    }

    getUserRole() {
        return this.state.userRole;
    }

    setData(data) {
        this.updateState({ data });
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}

export default Store;
