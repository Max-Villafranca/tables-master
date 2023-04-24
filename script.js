import {InlineMultController} from './controllers.js'

//functions
function highlightColumn(e) {
    document.querySelectorAll(`.${e.target.dataset.linkFactors}`).forEach(i => {
        i.classList.toggle('multiplicationHighlight')
    })
}

function highlightRow(e) {
    for (const i of e.composedPath()[1].children) {
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
    }
}

function enableKeypad(){
    let validKey = ['1','2','3','4','5','6','7','8','9','0','Enter','Backspace']
    document.addEventListener('keydown', e => {
        if (!validKey.includes(e.key) || !modalWrapper.classList.contains('invisible') || !multiplications) return
        else if (e.key === 'Enter') multiplications.checkAnswer()
        else if (e.key === 'Backspace') multiplications.backspace()
        else multiplications.appendNumber(e)
    })
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
        if (e.cancelable) e.preventDefault()
    },{passive:false})

    document.querySelector('.tablesEditor').addEventListener('touchend', e => {
        if (e.cancelable) e.preventDefault()
    })
}

function enableSelectTables() {
    columnHeads.forEach(i => { i.addEventListener('click', selectColumn) })
    columnHeads.forEach(i => { i.addEventListener('touchstart', selectColumn,{passive: true}) })
    
    rowHeads.forEach(i => { i.addEventListener('click', selectRow) })
    rowHeads.forEach(i => { i.addEventListener('touchstart', selectRow,{passive: true}) })
    
    singleCell.forEach(i => { i.addEventListener('click', selectSingleCell) })
    singleCell.forEach(i => { i.addEventListener('touchstart', selectSingleCell,{passive: true}) })
    
    allCells.addEventListener('click', selectAllCells)
    allCells.addEventListener('touchstart', selectAllCells,{passive: true})
}

function showEditPanel() {
    practicePanel.classList.add('invisible')
    editPanel.classList.remove('invisible')
}

function showPracticePanel() {
    editPanel.classList.add('invisible')
    practicePanel.classList.remove('invisible')
}

function endpracticesession() {
    multiplications = null
    localStorage.clear()
}

// variables
const columnHeads = document.querySelectorAll('.tablesEditor tr:first-child>th:not(#allTables)')
const rowHeads = document.querySelectorAll('.tablesEditor :not(:first-child) th')
const singleCell = document.querySelectorAll('.tablesEditor td')
const allCells = document.querySelector('#allTables')
const editPanel = document.querySelector('.editPanel')
const practicePanel = document.querySelector('.practicePanel')
const modalWrapper = document.querySelector('.modal-wrapper')
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
let multiplications = new InlineMultController(multiplicationTables, getSettings())


document.querySelector('.practice').addEventListener('click', () => {
    if (!practicePanel.classList.contains('invisible')) return
    if (multiplicationTables.length === 0 || getSettings().playlistLength == 0) return
    multiplications = new InlineMultController(multiplicationTables, getSettings())
    multiplications.play()
    showPracticePanel()
})

document.querySelector('.edit').addEventListener('click', () => {
    if (multiplications === null || !editPanel.classList.contains('invisible')) return
    if (multiplications.sessionCompleted()) { showEditPanel(); return }
    if (multiplications.getPlaylistProgress === 0) {
        endpracticesession()
        showEditPanel()
    } else {
        modalWrapper.classList.remove('invisible')
    }
})

document.querySelector('#yes-endPractice').addEventListener('click', () => {
    modalWrapper.classList.add('invisible')
    multiplications.displayResults(false)
    endpracticesession()
    setTimeout(() => {
        showEditPanel()
    }, 3000);
})

//*event listeners to close modal.
document.querySelector('#no-endPractice').addEventListener('click', () => {
    modalWrapper.classList.add('invisible')
})

document.addEventListener('keydown', e => {
    if (e.code === 'Escape') modalWrapper.classList.add('invisible')
})

modalWrapper.addEventListener('click', e => {
    if (e.target === modalWrapper) modalWrapper.classList.add('invisible')
})
// end *event listeners to close modal.

multiplications.play()
enableKeypad()
enableHighlightTables()
enableSelectTables()

