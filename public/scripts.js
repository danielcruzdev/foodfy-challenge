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

function addIngredient() {
  const ingredients = document.querySelector("#ingredients");
  const fieldContainer = document.querySelectorAll(".ingredient");

  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  ingredients.appendChild(newField);
}

document
  .querySelector(".add-ingredient")
  .addEventListener("click", addIngredient);

function addPreparation() {
  const preparation = document.querySelector("#preparation");
  const fieldContainer = document.querySelectorAll(".preparation");

  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  preparation.appendChild(newField);
}

document
  .querySelector(".add-preparation")
  .addEventListener("click", addPreparation);
