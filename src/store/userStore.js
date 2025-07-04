class userStore {
    constructor() {
        this.userName = 'PLAYER!'
        this.userImg = 'bot_ma0000'
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