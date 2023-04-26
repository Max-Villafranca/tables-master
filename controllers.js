import { InlineMultView } from "./views.js"
import { InlineMultModel } from "./models.js"
import { getSettings } from "./script.js"


export class InlineMultController {
    #sessionCompleted = false

    constructor(tables, settings) {
        this.tables = tables
        this.settings = settings
        this.view = new InlineMultView(this)
        this.model = new InlineMultModel(this, tables, settings)
    }

    play() {
        if (this.getPlaylistProgress() >= this.model.settings.playlistLength) {
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
        return 100 / this.model.settings.playlistLength * this.getPlaylistProgress()
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
        this.model.newSession(this.tables, getSettings())
        this.view.newSession()
        this.#sessionCompleted = false
        this.play()
    }
}