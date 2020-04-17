const cards = document.querySelectorAll(".recipe-card");
const details = document.querySelectorAll(".details-info");

for (let card of cards) {
  card.addEventListener("click", () => {
    const receitaID = card.getAttribute("id");
    window.location.href = `/receitas/${receitaID}`;
  });
}

for (let detail of details) {
  let a = detail.querySelector("a");

  a.addEventListener("click", function () {
    if (detail.querySelector(".detail-content").classList.contains("hidden")) {
      a.innerText = "ESCONDER";
      detail.querySelector(".detail-content").classList.remove("hidden");
    } else {
      a.innerText = "MOSTRAR";
      detail.querySelector(".detail-content").classList.add("hidden");
    }
  });
}
