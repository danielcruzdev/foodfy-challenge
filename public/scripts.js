const cards = document.querySelectorAll(".recipe-card");

for (let card of cards) {
  card.addEventListener("click", () => {
    const receitaID = card.getAttribute("id");
  })
}
