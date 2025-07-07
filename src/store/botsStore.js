import { botsList } from "../content/botsList";
import engineStore from "./engineStore";

class botsStore {
    constructor() {
        this.pause = true;
        this.bots = [];
        this.losers = [];

        this.currentRound = 0;
        this.roundsFinished = 0

        this.botsPlaySpeed = 4;
        this.botsPlaySpeedTolerance = 2;
        this.botsSpawnMax = 3;
    }

    initNextRound(winner = false) {
        // Побеждает бот — дропаем всё
        if (winner.isBot) return this.clearAll();

        this.pause = true;

        // Первый раунд — спавним ботов
        if (!this.bots.length && this.currentRound === 0) {
            this.spawn(this.botsSpawnMax, true);
            this.currentRound++;
            return;
        }

        // Найти бота с минимальным cardsFinished
        let loserIndex = -1;
        let minFinished = Infinity;

        for (let i = 0; i < this.bots.length; i++) {
            const bot = this.bots[i];
            if (bot.cardsFinished < minFinished) {
                minFinished = bot.cardsFinished;
                loserIndex = i;
            }
        }

        if (loserIndex !== -1) {
            const [loserBot] = this.bots.splice(loserIndex, 1);
            loserBot.loser = true;
            this.losers.push(loserBot);
        }

        this.currentRound++;

        // Сбрасываем cardsFinished всем оставшимся ботам
        for (const bot of this.bots) {
            bot.cardsFinished = 0;
        }

        // Если все боты уже проиграли — конец
        if (!this.bots.length && this.losers.length) {
            return this.clearAll();
        }
    }


    setPause(value = true) {
        this.pause = value;
    }

    update() {
        if (this.pause) return;

        if (!this.bots.length) return;
        this.bots.forEach(bot => {
            if (bot.cardsFinished === bot.maxCards) {
                //this.clearAll();
                return engineStore.finishGame(bot);
            }


            //Если прошел таймаут значит бот делает ход, если нет, обновляем таймаут
            if (bot.timeoutStep <= 0) {
                bot.cardsFinished += 1;
                bot.timeoutStep = bot.timeoutStepUpdate();
                //console.log(bot.name, 'делает ход')
                bot.textCars.setText(`${bot.cardsFinished}/${engineStore.cards * 4}`)
            } else {
                bot.timeoutStep -= 1;
            }
        })
    }

    get getCurrentBots() {
        return this.bots;
    }

    getBotStepTime() {
        const minCards = 4;
        const maxCards = 13;
        const cardsInRow = engineStore.cards;

        // ограничим диапазон
        let range = Math.max(minCards, Math.min(maxCards, cardsInRow));

        // среднее время и погрешность
        let dt = (range - minCards) / (maxCards - minCards);
        let avgTime = 3 + (12 - 3) * dt;// от 3 до 12 сек
        let tolerance = 2 + (8 - 2) * dt;// от ±2 до ±8 сек

        // Генерируем случайное время в пределах (avg ± tolerance)
        let minTime = avgTime - tolerance;
        let maxTime = avgTime + tolerance;

        return Math.random() * (maxTime - minTime) + minTime;
    }


    spawn(amount, clearSpawn = false) {
        if (!amount || amount === 0) return null;
        if (clearSpawn) this.bots = [];


        let shuffled = [...botsList].sort(() => 0.5 - Math.random());
        let maxCards = engineStore.cards * 4;

        const selectedBots = shuffled.slice(0, amount).map(bot => {

            return {
                ...bot,
                maxCards, // макс карт всего
                cardsFinished: 0, // сколько карт уже складеных. Переделано что бы у всех одинаково было в начале
                loser: false, // ещё не проиграл
                isBot: true,

                lastStep: 0,
                timeoutStep: 0,
                timeoutStepUpdate: () => this.getBotStepTime()
            };
        });

        this.bots = selectedBots;
        return selectedBots;
    }
    giveCardsToBots(value) {
        if (!value || value < 0) return;

        this.bots.forEach(bot => bot.cardsFinished = value)
    }

    clearAll() {
        this.bots = [];
        this.losers = [];
        this.currentRound = 0;
    }
}

export default new botsStore();