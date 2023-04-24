const restartPracticeButton = document.querySelector('#restartPractice')

export class InlineMultView {
    #expectingInput = false

    constructor(controller) {
        this.controller = controller
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

        document.querySelectorAll('.numberKeys').forEach(button => {
            button.addEventListener('click', (e) => { this.appendNumber(e) })
        })
        document.querySelector('#backspace').addEventListener('click', (e) => { this.backspace(e) })
        
        document.querySelector('#enter').addEventListener('click', (e) => { this.enterAnswer() })
    }

    appendNumber(e) {
        let num = e.key ?? e.target.textContent
        if (!this.#expectingInput) return
        if (this.displayProduct.textContent.length >= 3) return
        this.displayProduct.textContent = this.displayProduct.textContent + num
    }

    backspace() {
        if (!this.#expectingInput) return
        this.displayProduct.textContent = this.displayProduct.textContent.slice(0, -1)
    }

    enterAnswer() {
        if (this.displayProduct.textContent == '') return
        if (!this.#expectingInput) return
        this.#expectingInput = false
        if (this.controller.isAnswerCorrect(parseInt(this.displayProduct.textContent))) {
            this.display.classList.add('correctAnswer')
        } else {
            this.display.classList.add('incorrectAnswer')
        }
        this.updateProgressBar()
        setTimeout( () => {
            this.display.classList.remove('correctAnswer');
            this.display.classList.remove('incorrectAnswer');
            this.controller.play()
        }, 1500);
    }

    updateProgressBar() {
        let progress = this.controller.progressPercentage
        this.progressBar.setAttribute('style',`width:${progress}%`)
    }

    displayResults(showRestartButton = true) {
        this.#expectingInput = false
        localStorage.clear()
        let message
        let playlistProgress = this.controller.getPlaylistProgress()
        const score = Math.round(this.controller.getCorrectAnswers() / playlistProgress * 1000) / 10
        if (score <= 50) message = '😣 ❌'
        if (score > 50 && score < 80) message = '😅 ❗'
        if (score >= 80 && score < 95) message = '😎 ✔️'
        if (score >= 95) message = '🥇 😃 🏆 '
        this.timesResponded.textContent = playlistProgress
        this.minutesPracticed.textContent = Math.round((Date.now() - this.controller.startTime) / 1000 / 60)
        this.score.textContent = `${score}% ${message}`
        this.display.classList.add('invisible')
        this.keyboard.classList.add('invisible')
        restartPracticeButton.classList.remove('invisible')
        if (!showRestartButton) restartPracticeButton.classList.add('invisible')
        this.results.classList.remove('invisible')
    }

    set expectingInput(flag) {
        this.#expectingInput = flag
    }
}

restartPracticeButton.addEventListener('click', () => {
    endpracticesession()
    multiplications = new InlineMultController(multiplicationTables, getSettings())
    multiplications.play()
})