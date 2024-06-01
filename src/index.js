import { errors } from "./validation/index.js";
let form = document.querySelector(".submit");
let editForm = document.querySelector(".edit");
let options = document.querySelector(".option");
let cards = document.querySelector(".cards"); // Changed to .cards for event delegation

const urlPrefix = "/api";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let title = document.querySelector(".submit .title");
  let recipe = document.querySelector(".submit .recipe");
  let img = document.querySelector(".submit .thumbnail");
  let error = document.querySelector(".error");
  let errorMessages = errors([title.value, recipe.value, img.value]);
  let keys = Object.keys(errorMessages).length;
  let values = Object.values(errorMessages);

  if (keys > 0) {
    error.innerHTML = "";
    values.forEach((v) => {
      let p = document.createElement("p");
      p.textContent = v;
      error.appendChild(p);
    });
    error.classList.remove("hide");
    console.log("i found errors");
    return;
  }

  error.innerHTML = "";
  error.classList.add("hide");

  sendData(formData);
  title.value = ``;
  recipe.value = ``;
  img.value = ``;
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(editForm);
  formData.append("id", document.querySelector(".edit .id").value);
  let title = document.querySelector(".edit .title");
  let recipe = document.querySelector(".edit .recipe");
  let img = document.querySelector(".edit .thumbnail");
  let error = document.querySelector(".error");

  let errorMessages = errors([title.value, recipe.value, img.value], true);
  let keys = Object.keys(errorMessages).length;
  let values = Object.values(errorMessages);
  if (keys > 0) {
    error.innerHTML = "";
    values.forEach((v) => {
      let p = document.createElement("p");
      p.textContent = v;
      error.appendChild(p);
    });
    error.classList.remove("hide");
    console.log("i found errors");
    return;
  }

  error.innerHTML = "";
  error.classList.add("hide");

  updateData(formData);
  document.querySelector(".edit .id").value = ``;
  title.value = ``;
  recipe.value = ``;
  document.querySelector(".edit .thumbnail").value = ``;
});

/**
 *
 * @param {FormData} formData
 */
function sendData(formData) {
  fetch(urlPrefix + "/submit", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.text();
    })
    .then((data) => {
      console.log("Data sent:");
      displayData();
    })
    .catch((error) => {
      console.error("Something went wrong when sending data:", error);
    });
}
/**
 *
 * @param {FormData} formData
 */
function updateData(formData) {
  fetch(urlPrefix + "/update", {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.text();
    })
    .then((data) => {
      console.log("updated");
      displayData();
    })
    .catch((error) => {
      console.error("Something went wrong while updating: ", error);
    });
}

function deleteCard(id) {
  fetch(urlPrefix + "/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.text();
    })
    .then((data) => {
      document.querySelector(`input[value='${id}']`).closest(".card").remove();
      console.log("data deleted");
    })
    .catch((error) => {
      console.error("Something went wrong when deleting data:", error);
    });
}

async function getData() {
  try {
    const response = await fetch(urlPrefix + "/data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("HTTP error, status = " + response.status);
    }
    const data = await response.json();
    console.log("Data received: ", data);
    return data;
  } catch (error) {
    console.error("Something went wrong when fetching data:", error);
    return [];
  }
}

async function displayData() {
  let data = await getData();
  if (data.length < 1) return;
  cards.innerHTML = "";

  data.forEach((item) => {
    let card = `
    <div class="card">
          <input type="hidden" class="id" value ="${item.id}">
          <div class="card-title">
            ${item.title}
          </div>
          <div class="card-thumbnail">
            <img
              src="./assets/images/thumbnail/${item.thumbnail}"
              alt="somthing is wrong"
            />
          </div>
          <pre class="card-recipe">${item.recipe}</pre>
          <div class="menu hide">
            <div class="del">Delete</div>
          </div>
          <div class="option">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
    `;
    let tempDev = document.createElement("div");
    tempDev.innerHTML = card;
    let cardNode = tempDev.firstElementChild;
    cards.appendChild(cardNode);
  });
}
displayData();

cards.addEventListener("click", (e) => {
  if (e.target.closest(".option")) {
    console.log("Option clicked");
    let menu = e.target.closest(".card").querySelector(".menu");
    menu.classList.toggle("hide");
  }
  if (e.target.closest(".del")) {
    let id = e.target.closest(".card").querySelector("input.id").value;
    deleteCard(id);
    displayData();
  }
  if (e.target.closest(".card")) {
    let cardChildren = e.target.closest(".card").children;
    let id = cardChildren[0].value.trim();
    let title = cardChildren[1].innerHTML.trim();
    let recipe = cardChildren[3].innerHTML.trim();
    let img = cardChildren[2].children[0].src;
    document.querySelector(".edit .img-src").value = img;
    document.querySelector(".edit .id").value = id;
    document.querySelector(".edit .title").value = title;
    document.querySelector(".edit .recipe").value = recipe;
  }
});
