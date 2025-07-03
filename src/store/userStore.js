class userStore {
    constructor() {
        this.userName = 'PLAYER!'
        this.userImg = 'bot_ma0000'


        //temp
        this.userPlayTIme = 0; // игровое время в раунде
        this.userMoves = 0; // сколько ходов сделал за раунд
        this.userScores = 0; // очки?
        this.userCash = 1000; // баланс игрока
        this.userShufflesPrice = 50; // цена за 1 перемешенивание карт
        this.userHintPrice = 25; // цена за 1 перемешенивание карт
        this.userMoneyDropSteps = 3; // 10 кликов(удачных) осталось до шанса получить монетки
        this.userHintTimeouts = [1, 3, 5] // первый уровень срабатывание через секунду, второй - через 3сек и т.д...
    }
    update() { }
    dataSave() { }
    dataLoad() { }
    get dataGet() {
        return {
            name: this.userName,
            img: this.userImg,
        }
    }
}

export default new userStore()