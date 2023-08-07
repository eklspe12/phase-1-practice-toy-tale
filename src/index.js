let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function newToyCard(toy) {
  const card = document.createElement("div");
  card.classList.add("card");

  const toyName = document.createElement("h2");
  toyName.textContent = toy.name;

  const toyImg = document.createElement("img");
  toyImg.classList.add("toy-avatar");
  toyImg.src = toy.image;

  const toyLikes = document.createElement("p");
  toyLikes.textContent = `${toy.likes} likes!`;

  const toyButton = document.createElement("button");
  toyButton.textContent = "👍";
  toyButton.classList.add("like-btn");
  toyButton.id = toy.id;
  toyButton.addEventListener("click", () => {
    handleLike(toy.id, toyLikes);
  });

  card.appendChild(toyName);
  card.appendChild(toyImg);
  card.appendChild(toyLikes);
  card.appendChild(toyButton);

  return card;
}

function getToys() {
  document.addEventListener("DOMContentLoaded", () => {
    const allToys = document.querySelector("#toy-collection");
    const toyForm = document.querySelector(".add-toy-form");

    fetchToysAndRender(allToys);

    toyForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(toyForm);
      const toyData = {
        name: formData.get("name"),
        image: formData.get("image"),
        likes: 0,
      };

      addNewToy(toyData, allToys);
      toyForm.reset();
    });
  });
}

function fetchToysAndRender(allToys) {
  fetch("http://localhost:3000/toys")
    .then((r) => r.json())
    .then((toy) => {
      toy.forEach((toy) => {
        const toyCard = newToyCard(toy);
        allToys.appendChild(toyCard);
      });
    })
    .catch((error) => console.error("Error fetching toys", error));
}

function addNewToy(toyData, allToys) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
      Accept: "application/JSON",
    },
    body: JSON.stringify(toyData),
  })
    .then((response) => response.json())
    .then((newToy) => {
      const toyCard = newToyCard(newToy);
      allToys.appendChild(toyCard);

      const toyButton = toyCard.querySelector(".like-btn");
      const toyLikes = toyCard.querySelector("p");
      toyButton.addEventListener("click", () => {
        handleLike(newToy.id, toyLikes);
      });
    })
    .catch((error) => console.error("Error adding new toy:", error));
}

function handleLike(toyId, likesElement) {
  const updateLikes = parseInt(likesElement.textContent) + 1;
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/JSON",
      Accept: "application/JSON",
    },
    body: JSON.stringify({
      likes: updateLikes,
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      likesElement.textContent = `${data.likes} likes!`;
    })
    .catch((error) => console.error("Error adding likes", error));
}

getToys();
