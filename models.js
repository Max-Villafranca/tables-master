export class InlineMultModel {
    #playlistProgress = 0
    #settings
    #tables
    #state
    #correctAnswers = 0
    #currentTableCompleted = true
    #tablesGenerated = []
    #factorsGenerated = []
    #lastFactors = {}
    #startTime

    constructor(controller, tables, settings) {
        this.controller = controller
        this.#tables = tables
        this.newSession(tables, settings)
    }

    getNextMultiplication() {
        let a, b, swapAB
        let getOrderedFacotorA = () => {
            if (this.#currentTableCompleted) {
                // if we are on the last table => tablesGenerated = []
                if (this.#tablesGenerated.length === this.#tables.tables.length) this.#tablesGenerated = []
                this.#currentTableCompleted = false
                this.#tablesGenerated.push(this.#tables.tables[this.#tablesGenerated.length])
            }
            // append the next table to tablesGenerated
            return this.#tablesGenerated[this.#tablesGenerated.length - 1]
        }

        let getOrderedFacotorB = () => {
            let grabBeforeEmptyingArray
            // if we are on the last FactorB of the current table
            if (this.#factorsGenerated.length === this.#tables[a].length - 1) {
                this.#currentTableCompleted = true
                grabBeforeEmptyingArray = this.#tables[a][this.#tables[a].length - 1]
                this.#factorsGenerated = []
                // return the last FactorB of the current table
                return grabBeforeEmptyingArray
            } else {
                // append the current FactorB to factorsGenerated and return it
                this.#factorsGenerated.push(this.#tables[a][this.#factorsGenerated.length])
                return this.#factorsGenerated[this.#factorsGenerated.length - 1]
            }
        }

        if (this.#settings.randomFactors) {
            a = this.#tables.tables[Math.floor(Math.random() * this.#tables.tables.length)]
        } else {
            a = getOrderedFacotorA()
        }
        if (this.#settings.randomFactors) {
            b = this.#tables[a][Math.floor(Math.random() * this.#tables[a].length)]
        } else {
            b = getOrderedFacotorB()
        }
        if (this.#settings.swapFactors && Math.random() > .5) {
            swapAB = a
            a = b
            b = swapAB
            console.log('⇄')
        }
        this.#lastFactors = { a, b }
        return { a, b };
    }

    syncLocalStorage(tables, settings) {
        if (!localStorage.getItem('state') ||
            !localStorage.getItem('tables') ||
            !localStorage.getItem('settings')) {
            this.#startTime = Date.now()
            this.#settings = settings
            this.#tables = tables
            this.#state = {
                startTime: this.#startTime,
                playlistProgress: this.#playlistProgress,
                correctAnswers: this.#correctAnswers
            }
            localStorage.setItem('settings', JSON.stringify(this.#settings))
            localStorage.setItem('tables', JSON.stringify(this.#tables))
            localStorage.setItem('state', JSON.stringify(this.#state))
        } else {
            this.#settings = JSON.parse(localStorage.getItem('settings'))
            this.#tables = JSON.parse(localStorage.getItem('tables'))
            this.#state = JSON.parse(localStorage.getItem('state'))
            this.#startTime = this.#state.startTime
            this.#correctAnswers = this.#state.correctAnswers
            this.#playlistProgress = this.#state.playlistProgress
        }
    }

    isAnswerCorrect(enteredAnswer) {
        let correctAnswer = this.#lastFactors.a * this.#lastFactors.b
        this.#playlistProgress ++
        if (correctAnswer === enteredAnswer) {
            this.updateSaveScore(1)
            return true
        }
        this.updateSaveScore(0)
        return false
    }

    updateSaveScore(ans) {
        if (ans === 1) this.#correctAnswers++
        this.#state.playlistProgress = this.#playlistProgress
        this.#state.correctAnswers = this.#correctAnswers
        localStorage.setItem('state', JSON.stringify(this.#state))
    }

    getPlaylistProgress() {
        return this.#playlistProgress
    }

    getCorrectAnswers() {
        return this.#correctAnswers
    }

    get startTime() {
        return this.#startTime
    }

    get playlistLength() {
        return this.#settings.playlistLength
    }

    reset() {
        this.#playlistProgress = 0
        this.#correctAnswers = 0
        this.#currentTableCompleted = true
        this.#tablesGenerated = []
        this.#factorsGenerated = []
        this.#lastFactors = {}
        this.#startTime = undefined
        localStorage.clear()
    }

    newSession(tables, settings) {
        this.syncLocalStorage(tables, settings)
    }
}