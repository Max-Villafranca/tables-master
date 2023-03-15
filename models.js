export class InlineMultModel {
    #playlistProgress = 0
    #correctAnswers = 0
    #expectingInput = false
    constructor (tables, settings){
        this.startTime
        this.syncLocalStorage(tables, settings)
    }
    
    syncLocalStorage(tables, settings) {
        if (!localStorage.getItem('state')){
            const startTime = Date.now()
            this.settings = settings
            this.tables = this.sortTables(tables)
            this.state = {
                startTime: startTime,
                playlistProgress: this.#playlistProgress,
                correctAnswers: this.#correctAnswers
            }
            localStorage.setItem('settings', JSON.stringify(this.settings))
            localStorage.setItem('tables', JSON.stringify(this.tables))
            localStorage.setItem('state', JSON.stringify(this.state))
        } else {
            this.settings = JSON.parse(localStorage.getItem('settings'))
            this.tables = JSON.parse(localStorage.getItem('tables'))
            this.state = JSON.parse(localStorage.getItem('state'))
            this.startTime = this.state.startTime
            this.#correctAnswers = this.state.correctAnswers
            this.#playlistProgress = this.state.playlistProgress
        }
    }

    sortTables(t) {
        let sortedTables = { tables: [] }
        let factorA = Object.keys(t)

        for (let i = 0; i < factorA.length; i++) {
            let tempArray = []
            for (let j = 0; j < t[factorA[i]].length; j++) {
                let factorB = t[factorA[i]]
                if (factorB[j]) tempArray.push(j + 1)
            }
            if (tempArray.length > 0) {
                sortedTables.tables.push(i + 1)
                sortedTables[i + 1] = tempArray
            }
        }
        return sortedTables
    }

    checkAnswer() {
        if (!this.#expectingInput) return
        if (view.displayProduct.textContent == '') return
        this.#expectingInput = false
        let correctAnswer = view.displayFactorA.textContent * view.displayFactorB.textContent
        let enteredAnswer = parseInt(view.displayProduct.textContent)
        this.#playlistProgress ++
        view.updateProgressBar()
        if (correctAnswer === enteredAnswer) {
            view.updateSaveScore(1)
            view.display.classList.add('correctAnswer')
        } else {
            view.updateSaveScore(0)
            view.display.classList.add('incorrectAnswer')
        }
        setTimeout( () => {
            view.display.classList.remove('correctAnswer');
            view.display.classList.remove('incorrectAnswer');
            view.play()
        }, 1500);
    }

    updateSaveScore(ans) {
        if (ans === 1) this.#correctAnswers++
        view.state.playlistProgress = this.#playlistProgress
        view.state.correctAnswers = this.#correctAnswers
        localStorage.setItem('state', JSON.stringify(view.state))
    }

    getPlaylistProgress (){
        return this.#playlistProgress
    }

    getCorrectAnswers (){
        return this.#correctAnswers
    }

    getExpectingInput(){
        return this.#expectingInput
    }

    setExpectingInput(bool){
        this.#expectingInput = bool
    }
}