class PracticeSession {
    #sessionEnded = false
    #correctAnswers = 0
    #currentTableCompleted = true
    #expectingInput = false
    #tablesGenerated = []
    #factorsGenerated = []
    constructor(tables, settings) {
        this.startTime = performance.now()
        this.display = document.querySelector('.display')
        this.score = document.querySelector('.score')
        this.keyboard = document.querySelector('.keyboard')
        this.timesResponded = document.querySelector('#times-responded')
        this.minutesPracticed = document.querySelector('#minutes-practiced')
        this.results = document.querySelector('.results')
        this.displayFactorA = document.querySelector('#displayFactorA')
        this.displayFactorB = document.querySelector('#displayFactorB')
        this.displayProduct = document.querySelector('#displayProduct')
        this.settings = settings
        this.tables = this.sortTables(tables)
        this.results.classList.add('invisible')
        this.display.classList.remove('invisible')
        this.keyboard.classList.remove('invisible')
    }

    play() {
        if (this.settings.playlistProgress === this.settings.playlistLength) return this.displayResults()
        let factors = this.getNextMultiplication()
        this.displayProduct.textContent = ''
        this.displayFactorA.textContent = factors.a
        this.displayFactorB.textContent = factors.b
        this.#expectingInput = true
    }

    appendNumber(e) {
        if (!this.#expectingInput) return
        if (this.displayProduct.textContent.length >= 3) return
        this.displayProduct.textContent = this.displayProduct.textContent.toString() + e.target.textContent.toString()
    }

    backspace() {
        if (!this.#expectingInput) return
        this.displayProduct.textContent = this.displayProduct.textContent.slice(0, -1)
    }

    checkAnswer() {
        if (!this.#expectingInput) return
        if (this.displayProduct.textContent == '') return
        this.#expectingInput = false
        this.settings.playlistProgress++
        let correctAnswer = this.displayFactorA.textContent * this.displayFactorB.textContent
        let enteredAnswer = parseInt(this.displayProduct.textContent)
        if (correctAnswer === enteredAnswer) {
            this.updateSaveScore(1)
            this.display.classList.add('correctAnswer')
        } else {
            this.updateSaveScore(0)
            this.display.classList.add('incorrectAnswer')
        }
        setTimeout( () => {
            this.display.classList.remove('correctAnswer');
            this.display.classList.remove('incorrectAnswer');
            this.play()
        }, 1500);
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

    getNextMultiplication() {
        let a, b, swapAB
        let getOrderedFacotorA = () => {
            if (this.#currentTableCompleted) {
                // if we are on the last table => tablesGenerated = []
                if (this.#tablesGenerated.length === this.tables.tables.length) this.#tablesGenerated = []
                this.#currentTableCompleted = false
                this.#tablesGenerated.push(this.tables.tables[this.#tablesGenerated.length])
            }
            // append the next table to tablesGenerated
            return this.#tablesGenerated[this.#tablesGenerated.length - 1]
        }

        let getOrderedFacotorB = () => {
            let grabBeforeEmptyingArray
            // if we are on the last FactorB of the current table
            if (this.#factorsGenerated.length === this.tables[a].length - 1) {
                this.#currentTableCompleted = true
                grabBeforeEmptyingArray = this.tables[a][this.tables[a].length - 1]
                this.#factorsGenerated = []
                // return the last FactorB of the current table
                return grabBeforeEmptyingArray
            } else {
                // append the current FactorB to factorsGenerated and return it
                this.#factorsGenerated.push(this.tables[a][this.#factorsGenerated.length])
                return this.#factorsGenerated[this.#factorsGenerated.length - 1]
            }
        }

        if (this.settings.randomFactors) {
            a = this.tables.tables[Math.floor(Math.random() * this.tables.tables.length)]
        } else {
            a = getOrderedFacotorA()
        }
        if (this.settings.randomFactors) {
            b = this.tables[a][Math.floor(Math.random() * this.tables[a].length)]
        } else {
            b = getOrderedFacotorB()
        }
        if (this.settings.swapFactors && Math.random() > .5) {
            swapAB = a
            a = b
            b = swapAB
            console.log('⇄')
        }
        return { a, b };
    }

    displayResults(showRestartButton = true) {
        this.#expectingInput = false
        const score = Math.round(this.#correctAnswers / this.settings.playlistProgress * 1000) / 10
        let message =
            console.log(`Your Score is: ${score}%`)
        if (score <= 50) message = '😣 ❌'
        if (score > 50 && score < 80) message = '😅 ❗'
        if (score >= 80 && score < 95) message = '😎 ✔️'
        if (score >= 95) message = '🥇 😃 🏆 '
        this.timesResponded.textContent = this.settings.playlistProgress
        this.minutesPracticed.textContent = Math.round((performance.now() - this.startTime) / 1000 / 60)
        this.score.textContent = `${score}% ${message}`
        this.display.classList.add('invisible')
        this.keyboard.classList.add('invisible')
        restartPracticeButton.classList.remove('invisible')
        if (!showRestartButton) restartPracticeButton.classList.add('invisible')
        this.results.classList.remove('invisible')
        this.#sessionEnded = true
    }

    updateSaveScore(ans) {
        if (ans === 1) this.#correctAnswers++
        // const right = localStorage.getItem('right') ?? 0
        // const wrong = localStorage.getItem('wrong') ?? 0
        // if (ans===1) localStorage.setItem('right',`${parseInt(right)+1}`)
        // if (ans===0) localStorage.setItem('wrong',`${parseInt(wrong)+1}`)
    }

    sessionCompleted() {
        return this.#sessionEnded
    }
}

//functions
function highlightColumn(e) {
    document.querySelectorAll(`.${e.target.dataset.linkFactors}`).forEach(i => {
        i.classList.toggle('multiplicationHighlight')
    })
}

function highlightRow(e) {
    for (i of e.composedPath()[1].children) {
        i.classList.toggle('multiplicationHighlight')
    }
}

function highlightSingleCell(e) {
    e.target.classList.toggle('multiplicationHighlight')
}

function highlightAllCells(e) {
    singleCell.forEach(i => { i.classList.toggle('multiplicationHighlight') })
    e.target.classList.toggle('multiplicationHighlight')
}

function selectColumn(e) {
    let column = e.target.dataset.linkFactors
    let columnData = parseInt(column.substring(7))
    let isSelected = toggleSelectColumn[columnData-1]

    document.querySelectorAll(`.${column}:not(th)`).forEach((x, i) => {
        if (isSelected) {
            multiplicationTables[i+1][parseInt(x.textContent)-1] = false
            x.classList.remove('multiplicationSelect')
        } else {
            multiplicationTables[i+1][parseInt(x.textContent)-1] = true
            x.classList.add('multiplicationSelect')
        }
    })
    toggleSelectColumn[parseInt(column.substring(7))-1] = !isSelected
}

function selectRow(e) {
    let row = e.target.parentElement
    let rowData = parseInt(row.children[1].dataset.table)
    let isSelected = toggleSelectRow[rowData-1]

    row.querySelectorAll(':not(th)').forEach (i => {
        if (isSelected) {
            multiplicationTables[rowData][i.textContent-1] = false
            i.classList.remove('multiplicationSelect')
        } else {
            multiplicationTables[rowData][i.textContent-1] = true
            i.classList.add('multiplicationSelect')
        }
    })
    toggleSelectRow[rowData-1] = !isSelected
}

function selectSingleCell(e) {
    let factorA = e.target.dataset.table
    let factorB = parseInt(e.target.textContent)
    multiplicationTables[factorA][factorB - 1] = !multiplicationTables[factorA][factorB - 1]
    e.target.classList.toggle('multiplicationSelect')
}

function selectAllCells() {
    singleCell.forEach(i => {
        if (toggleSelectAllCells) {
            multiplicationTables[i.dataset.table][parseInt(i.textContent)-1] = false
            i.classList.remove('multiplicationSelect')
        } else {
            multiplicationTables[i.dataset.table][parseInt(i.textContent)-1] = true
            i.classList.add('multiplicationSelect')
        }
    })
    toggleSelectColumn.forEach((e,i) => toggleSelectColumn[i] = !toggleSelectAllCells)
    toggleSelectRow.forEach((e,i) => toggleSelectRow[i] = !toggleSelectAllCells)
    toggleSelectAllCells = !toggleSelectAllCells
}

function getSettings() {
    return {
        randomFactors: document.querySelector('[data-random-factors]').checked,
        swapFactors: document.querySelector('[data-swap-factors]').checked,
        playlistLength: parseInt(document.querySelector('[data-playlist-length]').value),
        playlistProgress: 0
    }
}

function getTables() {

}

function enableHighlightTables() {
    columnHeads.forEach(i => {
        i.addEventListener('mouseover', highlightColumn)
        i.addEventListener('mouseleave', highlightColumn)
    });
    
    rowHeads.forEach(i => {
        i.addEventListener('mouseover', highlightRow);
        i.addEventListener('mouseleave', highlightRow)
    });
    
    singleCell.forEach(i => {
        i.addEventListener('mouseover', highlightSingleCell)
        i.addEventListener('mouseleave', highlightSingleCell)
    });
    
    allCells.addEventListener('mouseover', highlightAllCells)
    allCells.addEventListener('mouseleave', highlightAllCells)
    
    document.querySelector('.tablesEditor').addEventListener('touchstart', e => {
        e.preventDefault()
        let x = e.changedTouches[0].clientX
        let y = e.changedTouches[0].clientY
        console.log(document.elementFromPoint(x,y))
    })
    
    document.querySelector('.tablesEditor').addEventListener('touchend', e => {
        e.preventDefault()
        let x = e.changedTouches[0].clientX
        let y = e.changedTouches[0].clientY
        console.log(document.elementFromPoint(x,y))
    })
}

function enableSelectTables() {
    columnHeads.forEach(i => { i.addEventListener('click', selectColumn) })
    columnHeads.forEach(i => { i.addEventListener('touchstart', selectColumn) })
    
    rowHeads.forEach(i => { i.addEventListener('click', selectRow) })
    rowHeads.forEach(i => { i.addEventListener('touchstart', selectRow) })
    
    singleCell.forEach(i => { i.addEventListener('click', selectSingleCell) })
    singleCell.forEach(i => { i.addEventListener('touchstart', selectSingleCell) })
    
    allCells.addEventListener('click', selectAllCells)
    allCells.addEventListener('touchstart', selectAllCells)
}

function showEditPanel() {
    editPanel.classList.remove('invisible')
    practicePanel.classList.add('invisible')
}

function showPracticePanel() {
    editPanel.classList.add('invisible')
    practicePanel.classList.remove('invisible')
}

// variables
const columnHeads = document.querySelectorAll('.tablesEditor tr:first-child>th:not(#allTables)')
const rowHeads = document.querySelectorAll('.tablesEditor :not(:first-child) th')
const singleCell = document.querySelectorAll('.tablesEditor td')
const allCells = document.querySelector('#allTables')
const editPanel = document.querySelector('.editPanel')
const restartPracticeButton = document.querySelector('#restartPractice')
const practicePanel = document.querySelector('.practicePanel')
let randomFactors = document.querySelector('[data-random-factors]')
let swapFactors = document.querySelector('[data-swap-factors]')
let playlistLength = document.querySelector('[data-playlist-length]')
let toggleSelectColumn = [true,true,true,true,true,true,true,true,true,true]
let toggleSelectRow = [true,true,true,true,true,true,true,true,true,true]
let toggleSelectAllCells = false

let multiplicationTables = {
    1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    10: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}
selectAllCells()
let multiplications = new PracticeSession(multiplicationTables, getSettings())

document.querySelectorAll('.numberKeys').forEach(button => {
    button.addEventListener('click', (e) => { multiplications.appendNumber(e) })
})
document.querySelector('#backspace').addEventListener('click', (e) => { multiplications.backspace(e) })
document.querySelector('#enter').addEventListener('click', (e) => { multiplications.checkAnswer(e) })


document.querySelector('.practice').addEventListener('click', () => {
    if (!practicePanel.classList.contains('invisible')) return
    multiplications = new PracticeSession(multiplicationTables, getSettings())
    if (multiplications.tables.tables.length === 0) return
    multiplications.play()
    showPracticePanel()
})

document.querySelector('.edit').addEventListener('click', () => {
    if (multiplications === null || !editPanel.classList.contains('invisible')) return
    if (multiplications.sessionCompleted()) { showEditPanel(); return }
    if (multiplications.settings.playlistProgress === 0) {
        multiplications = null
        showEditPanel()
    } else {
        document.querySelector('.modal-wrapper').classList.remove('invisible')
    }
})

document.querySelector('#yes-endPractice').addEventListener('click', () => {
    document.querySelector('.modal-wrapper').classList.add('invisible')
    multiplications.displayResults(false)
    multiplications = null
    setTimeout(() => {
        showEditPanel()
    }, 3000);
})

document.querySelector('#no-endPractice').addEventListener('click', () => {
    document.querySelector('.modal-wrapper').classList.add('invisible')
})

restartPracticeButton.addEventListener('click', () => {
    multiplications = null
    multiplications = new PracticeSession(multiplicationTables, getSettings())
    multiplications.play()
})

multiplications.play()
enableHighlightTables()
enableSelectTables()

