import { makeAutoObservable } from "mobx";
import { botsList } from "../botsList";

class botsStore {
    constructor() {
        this.bots = [];
        makeAutoObservable(this)
    }
    update() {
        if (!this.bots.length) return;

    }
    get getCurrentBots() {
        return this.bots;
    }
    spawn(amount, clearSpawn = false) {
        if (!amount || amount === 0) return null;
        if (clearSpawn) this.bots = [];

        const shuffled = [...botsList].sort(() => 0.5 - Math.random());
        this.bots = shuffled.slice(0, amount);
        return shuffled;
    }
    clearAll() {
        this.bots = [];
    }
}

export default new botsStore();