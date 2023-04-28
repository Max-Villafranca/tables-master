import { InlineMultView } from "./views.js"
import { InlineMultModel } from "./models.js"
import { getSettings, getTables } from "./script.js"


export class InlineMultController {
    #sessionCompleted = false

    constructor() {
        this.tables = getTables()
        this.settings = getSettings()
        this.view = new InlineMultView(this)
        this.model = new InlineMultModel(this, this.tables, this.settings)
    }

    play() {
        if (this.getPlaylistProgress() >= this.model.playlistLength) {
            this.view.displayResults()
            this.endPracticeSession()
        }
        let factors = this.model.getNextMultiplication()
        this.view.displayProduct.textContent = ''
        this.view.displayFactorA.textContent = factors.a
        this.view.displayFactorB.textContent = factors.b
        this.view.expectingInput = true
    }

    displayResults(flag) {
        this.view.displayResults(flag)
    }

    isAnswerCorrect(enteredAnswer) {
        return this.model.isAnswerCorrect(enteredAnswer)
    }

    get progressPercentage() {
        return 100 / this.model.playlistLength * this.getPlaylistProgress()
    }

    get startTime() {
        return this.model.startTime
    }

    getPlaylistProgress() {
        return this.model.getPlaylistProgress()
    }

    getCorrectAnswers() {
        return this.model.getCorrectAnswers()
    }

    sessionCompleted() {
        return this.#sessionCompleted
    }

    endPracticeSession() {
        this.view.reset()
        this.model.reset()
        this.#sessionCompleted = true
    }

    newSession() {
        let tables =  getTables()
        if (tables === false) return false
        this.model.newSession(tables, getSettings())
        this.view.newSession()
        this.#sessionCompleted = false
        this.play()
        return true
    }
}