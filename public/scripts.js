const cards = document.querySelectorAll(".recipe-card");
const details = document.querySelectorAll(".details-info");

if (cards) {
  for (let card of cards) {
    card.addEventListener("click", () => {
      const receitaID = card.getAttribute("id");
      window.location.href = `/receitas/${receitaID}`;
    });
  }
}

if (details) {
  for (let detail of details) {
    let a = detail.querySelector("a");

    a.addEventListener("click", function () {
      if (
        detail.querySelector(".detail-content").classList.contains("hidden")
      ) {
        a.innerText = "ESCONDER";
        detail.querySelector(".detail-content").classList.remove("hidden");
      } else {
        a.innerText = "MOSTRAR";
        detail.querySelector(".detail-content").classList.add("hidden");
      }
    });
  }
}

if (document.querySelector(".add-ingredient")) {
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
}

//Paginação

function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (
      firstAndLastPage ||
      (pagesBeforeSelectedPage && pagesAfterSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push("...");
      }

      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }

  return pages;
}

const pagination = document.querySelector(".pagination");

function createPagination(pagination) {
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const pages = paginate(page, total);
  const filter = pagination.dataset.filter;

  let elements = "";

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`;
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page} </a>`;
      } else {
        elements += `<a href="?page=${page}">${page}</a>`;
      }
    }
  }
  pagination.innerHTML = elements;
}

if (pagination) {
  createPagination(pagination);
}

// Galeria de fotos

const PhotosUpload = {
  input: null,
  preview: document.querySelector(".container-photos"),
  uploadLimit: 1,
  files: [],
  handleFileInput(event, limit) {
    const { files: filesList } = event.target;
    PhotosUpload.input = event.target;

    PhotosUpload.uploadLimit = limit || 1;

    if (PhotosUpload.uploadLimit === 1) {
      PhotosUpload.files = [];
      PhotosUpload.input.files = PhotosUpload.getAllFiles();
      Array.from(PhotosUpload.preview.children).forEach((preview) =>
        preview.remove()
      );
    }

    if (PhotosUpload.hasLimit(filesList)) {
      event.preventDefault();
      PhotosUpload.input.files = PhotosUpload.getAllFiles();
      return;
    }

    Array.from(filesList).forEach((file) => {
      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = PhotosUpload.getImage(reader.result);
        PhotosUpload.preview.appendChild(image);
      };

      reader.readAsDataURL(file);
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  getContainer(image) {
    const div = document.createElement("div");
    div.classList.add("photo");

    div.onclick = PhotosUpload.removePhoto;

    div.appendChild(image);

    div.appendChild(PhotosUpload.getRemoveButton());

    return div;
  },
  hasLimit(filesList) {
    if(filesList.length + PhotosUpload.files.length > PhotosUpload.uploadLimit) {
      alert(`Envie no máximo ${ PhotosUpload.uploadLimit } fotos!`)
      return true
  }

  return false
  },
  getImage(src) {
      const image = new Image()

      image.src = String(src)

      const div = document.createElement('div')
      div.classList.add('photo')

      if(PhotosUpload.uploadLimit > 1) {
          div.onclick = PhotosUpload.removePhoto
          div.appendChild(PhotosUpload.getRemoveButton())
      }

      div.appendChild(image)

      return div
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer();

    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getRemoveButton() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "delete";

    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode; // <div class="photo"
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv) - 1;
    console.log(event.target, photoDiv, index)

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode
        
    if(photoDiv.id) {
        const removedFile = document.createElement('input')
        removedFile.setAttribute('type', 'hidden')
        removedFile.setAttribute('name', 'removed_files[]')

        removedFile.value = photoDiv.id

        PhotosUpload.preview.appendChild(removedFile)
    }

    photoDiv.remove()
  },
};

const ImageGallery = {
  highlight: document.querySelector(".gallery .highlight > img"),
  previews: document.querySelectorAll(".gallery-preview img"),
  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach((preview) =>
      preview.classList.remove("active")
    );
    target.classList.add("active");

    ImageGallery.highlight.src = target.src;
    Lightbox.image.src = target.src;
  },
};

const Lightbox = {
  target: document.querySelector(".lightbox-target"),
  image: document.querySelector(".lightbox-target img"),
  closeButton: document.querySelector(".lightbox-target a.lightbox-close"),
  open() {
    Lightbox.target.style.opacity = 1;
    Lightbox.target.style.top = 0;
    Lightbox.target.style.bottom = 0;
    Lightbox.closeButton.style.top = 0;
  },
  close() {
    Lightbox.target.style.opacity = 0;
    Lightbox.target.style.top = "-100%";
    Lightbox.target.style.bottom = "initial";
    Lightbox.closeButton.style.top = "-80px";
  },
};
