class userStore {
    constructor() {
        this.userName = 'PLAYER!'
        this.userImg = 'user'
    }
    get dataGet() {
        return {
            name: this.userName,
            img: this.userImg,
        }
    }
    update() { }
    dataSave() { }
    dataLoad() { }

}

export default new userStore()