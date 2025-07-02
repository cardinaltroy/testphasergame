import { makeAutoObservable } from "mobx";
import { botsList } from "../content/botsList";
import engineStore from "./engineStore";

class botsStore {
    constructor() {
        this.pause = true;
        this.bots = [];
        this.losers = [];

        this.currentRound = 0;
        this.roundsFinished = 0
        
        this.botsPlaySpeed = 5;
        this.botsPlaySpeedTolerance = 1;
        this.botsSpawnMax = 3;
        makeAutoObservable(this)
    }
    initNextRound(winner = false) {
        //ПОбежадет бот, дропаем всё
        if (winner.isBot) return this.clearAll();

        this.pause = true;

        // Если ботов вообще нет — первый раунд
        if (!this.bots.length && this.currentRound === 0) {
            this.spawn(this.botsSpawnMax, true);
            this.currentRound++;
            //console.log('Спавним ботов. Раунд', this.currentRound);
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
            this.losers.push(loserBot);
            //console.log(`${loserBot.name} проиграл(а) и исключён(а)`);
        }

        this.currentRound++;
        //console.log('Следующий раунд', this.currentRound);

        // Если все боты уже проиграли — выход
        if (!this.bots.length && this.losers.length) {
            //console.log('Все боты проиграли');
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



    spawn(amount, clearSpawn = false) {
        if (!amount || amount === 0) return null;
        if (clearSpawn) this.bots = [];

        let shuffled = [...botsList].sort(() => 0.5 - Math.random());
        let maxCards = engineStore.cards * 4;
        let randomCards = engineStore.random;

        let randFunc = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const selectedBots = shuffled.slice(0, amount).map(bot => {
            // "Идеально собранное" число карт, без погрешности
            let cardsPerfectFinished = maxCards * (100 - randomCards) / 100;
            // Погрешность ±10%
            let deviation = (Math.random() * 0.2 - 0.1); // от -0.1 до +0.1
            let cardsFinished = Math.round(cardsPerfectFinished * (1 + deviation));

            // Ограничим допустимые значения от 4 до 7
            cardsFinished = Math.max(
                randFunc(4, 7),
                Math.min(cardsFinished, maxCards) - 1// -1 чтобы не было 100% складенных карт
            );

            return {
                ...bot,
                maxCards, // макс карт всего
                cardsFinished, // сколько карт уже складеных
                loser: false, // ещё не проиграл
                isBot: true,

                lastStep: 0,
                timeoutStep: 0,
                timeoutStepUpdate: () =>
                    randFunc(
                        this.botsPlaySpeed - this.botsPlaySpeedTolerance,
                        this.botsPlaySpeed + this.botsPlaySpeedTolerance
                    )
            };
        });

        this.bots = selectedBots;
        return selectedBots;
    }





    clearAll() {
        this.bots = [];
        this.losers = [];
        this.currentRound = 0;
    }
}

export default new botsStore();