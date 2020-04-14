const modalOverlay = document.querySelector('.modal-overlay')
const cards = document.querySelectorAll('.recipe-card')
const modal = document.querySelector('.modal')


for (let card of cards) {
    card.addEventListener('click', () => {
        const cursoID = card.getAttribute('id')
            modalOverlay.classList.add('active')
        })
    }

document.querySelector('.close-modal').addEventListener('click', () => {
    modalOverlay.classList.remove('active');
})