
const restartPracticeButton = document.querySelector('#restartPractice')

export class InlineMultView {

    constructor(controller) {
        this.display = document.querySelector('.display')
        this.score = document.querySelector('.score')
        this.keyboard = document.querySelector('.keyboard')
        this.timesResponded = document.querySelector('#times-responded')
        this.minutesPracticed = document.querySelector('#minutes-practiced')
        this.results = document.querySelector('.results')
        this.displayFactorA = document.querySelector('#displayFactorA')
        this.displayFactorB = document.querySelector('#displayFactorB')
        this.displayProduct = document.querySelector('#displayProduct')
        this.progressBar = document.querySelector('.progress')
        this.results.classList.add('invisible')
        this.display.classList.remove('invisible')
        this.keyboard.classList.remove('invisible')
        this.progressBar.setAttribute('style','width:0%')
    }

    appendNumber(e) {
        let num = e.key ?? e.target.textContent
        if (!this.model.getExpectingInput()) return
        if (this.model.displayProduct.textContent.length >= 3) return
        this.model.displayProduct.textContent = this.model.displayProduct.textContent + num
    }

    backspace() {
        if (!model.getExpectingInput()) return
        this.model.displayProduct.textContent = this.model.displayProduct.textContent.slice(0, -1)
    }

    updateProgressBar(){
        this.model.progressBar.setAttribute('style',
        `width:${100/this.model.settings.playlistLength*model.getPlaylistProgress()}%`)
    }

    displayResults(showRestartButton = true) {
        model.getExpectingInput() = false
        localStorage.clear()
        const score = Math.round(model.getCorrectAnswers() / model.getPlaylistProgress() * 1000) / 10
        let message
        if (score <= 50) message = '😣 ❌'
        if (score > 50 && score < 80) message = '😅 ❗'
        if (score >= 80 && score < 95) message = '😎 ✔️'
        if (score >= 95) message = '🥇 😃 🏆 '
        this.model.timesResponded.textContent = model.getPlaylistProgress()
        this.model.minutesPracticed.textContent = Math.round((Date.now() - this.model.startTime) / 1000 / 60)
        this.model.score.textContent = `${score}% ${message}`
        this.model.display.classList.add('invisible')
        this.model.keyboard.classList.add('invisible')
        this.model.restartPracticeButton.classList.remove('invisible')
        if (!showRestartButton) this.model.restartPracticeButton.classList.add('invisible')
        this.model.results.classList.remove('invisible')
    }
}

restartPracticeButton.addEventListener('click', () => {
    endpracticesession()
    multiplications = new InlineMultController(multiplicationTables, getSettings())
    multiplications.play()
})