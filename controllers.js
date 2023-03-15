import { InlineMultView } from "./views.js"
import { InlineMultModel } from "./models.js"

const view = new InlineMultView ()

export class InlineMultController {
    #sessionEnded = false
    #currentTableCompleted = true
    #tablesGenerated = []
    #factorsGenerated = []
    
    constructor(tables, settings){
        this.model = new InlineMultModel (tables, settings)
        this.playlistProgress = this.model.getPlaylistProgress()
    }

    play() {
        if (this.playlistProgress >= this.model.settings.playlistLength) {
            this.model.displayResults()
            this.#sessionEnded = true
        }
        let factors = this.getNextMultiplication()
        view.displayProduct.textContent = ''
        view.displayFactorA.textContent = factors.a
        view.displayFactorB.textContent = factors.b
        this.model.setExpectingInput(true)
    }

    getNextMultiplication() {
        let a, b, swapAB
        let getOrderedFacotorA = () => {
            if (this.#currentTableCompleted) {
                // if we are on the last table => tablesGenerated = []
                if (this.#tablesGenerated.length === this.model.tables.tables.length) this.#tablesGenerated = []
                this.#currentTableCompleted = false
                this.#tablesGenerated.push(this.model.tables.tables[this.#tablesGenerated.length])
            }
            // append the next table to tablesGenerated
            return this.#tablesGenerated[this.#tablesGenerated.length - 1]
        }

        let getOrderedFacotorB = () => {
            let grabBeforeEmptyingArray
            // if we are on the last FactorB of the current table
            if (this.#factorsGenerated.length === this.model.tables[a].length - 1) {
                this.#currentTableCompleted = true
                grabBeforeEmptyingArray = this.model.tables[a][this.model.tables[a].length - 1]
                this.#factorsGenerated = []
                // return the last FactorB of the current table
                return grabBeforeEmptyingArray
            } else {
                // append the current FactorB to factorsGenerated and return it
                this.#factorsGenerated.push(this.model.tables[a][this.#factorsGenerated.length])
                return this.#factorsGenerated[this.#factorsGenerated.length - 1]
            }
        }

        if (this.model.settings.randomFactors) {
            a = this.model.tables.tables[Math.floor(Math.random() * this.model.tables.tables.length)]
        } else {
            a = getOrderedFacotorA()
        }
        if (this.model.settings.randomFactors) {
            b = this.model.tables[a][Math.floor(Math.random() * this.model.tables[a].length)]
        } else {
            b = getOrderedFacotorB()
        }
        if (this.model.settings.swapFactors && Math.random() > .5) {
            swapAB = a
            a = b
            b = swapAB
            console.log('⇄')
        }
        return { a, b };
    }

    //check whos using this function
    sessionCompleted() {
        return this.#sessionEnded
    }
}


document.querySelectorAll('.numberKeys').forEach(button => {
    button.addEventListener('click', (e) => { view.appendNumber(e) })
})
document.querySelector('#backspace').addEventListener('click', (e) => { view.backspace(e) })

document.querySelector('#enter').addEventListener('click', (e) => { view.checkAnswer(e) })