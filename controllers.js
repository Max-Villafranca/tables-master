import { InlineMultView } from "./views.js"
import { InlineMultModel } from "./models.js"

export class InlineMultController {
    #sessionEnded = false
    
    constructor(tables, settings){
        this.view = new InlineMultView(this)
        this.model = new InlineMultModel(this, tables, settings)
        this.playlistProgress = this.model.getPlaylistProgress()
    }

    play() {
        if (this.playlistProgress >= this.model.settings.playlistLength) {
            this.model.displayResults()
            this.#sessionEnded = true
        }
        let factors = this.model.getNextMultiplication()
        this.view.displayProduct.textContent = ''
        this.view.displayFactorA.textContent = factors.a
        this.view.displayFactorB.textContent = factors.b
        this.view.expectingInput = true
    }

    displayResults (flag) {
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
        return this.#sessionEnded
    }
}