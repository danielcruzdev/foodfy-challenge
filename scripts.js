const modalOverlay = document.querySelector(".modal-overlay");
const cards = document.querySelectorAll(".recipe-card");

for (let card of cards) {
  card.addEventListener("click", () => {
    const recipeID = card.getAttribute("id");
    const image = document.querySelector('#image-modal')
    const h2 = document.querySelector('#h2-modal')
    const p = document.querySelector('#p-modal')
    modalOverlay.classList.add("active");
    if (recipeID === 'burguer') {
        p.innerHTML = 'por Jorge Relato'
        h2.innerHTML = 'Tiplo Bacon Burguer'
        image.setAttribute('src', '/assets/burger.png')
    }
    else if (recipeID === 'pizza') {
        p.innerHTML = 'por Fabiana Melo'
        h2.innerHTML = 'Pizza 4 estações'
        image.setAttribute('src', '/assets/pizza.png')
    }
    else if (recipeID === 'espaguete') {
        p.innerHTML = 'por Júlia Kinoto'
        h2.innerHTML = 'Espaguete ao molho'
        image.setAttribute('src', '/assets/espaguete.png')
    }
    else if (recipeID === 'lasanha') {
        p.innerHTML = 'por Juliano Vieira'
        h2.innerHTML = `Lasanha mac n' chesse`
        image.setAttribute('src', '/assets/lasanha.png')
    }
    else if (recipeID === 'doce') {
        p.innerHTML = 'por Ricardo Golvea'
        h2.innerHTML = 'Docinhos pão-do-céu'
        image.setAttribute('src', '/assets/doce.png')
    }
    else if (recipeID === 'asinhas') {
        p.innerHTML = 'por Vania Steroski'
        h2.innerHTML = 'Asinhas de frango ao barbecue'
        image.setAttribute('src', '/assets/asinhas.png')
    }
  });
}

document.querySelector(".close-modal").addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});
