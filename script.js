"use strict";

const countriesContainer = document.querySelector(".countries");
const form = document.querySelector(".input-form");
const textBox = document.querySelector(".input-country");
const submit = document.querySelector(".input-submit");
textBox.addEventListener("keyup", callRenderCountry);
submit.addEventListener("click", callRenderCountry);

//PreventDefault
form.addEventListener("submit", callRenderCountry);

//EventHandler Function
function callRenderCountry(e) {
  e.preventDefault();
  //selcting cards inside node list
  let card = document.querySelectorAll(".country");
  if (e.key === "Enter" || e.type === "click") {
    //removing last card & neighbours if any from the node list
    if (card.length > 0) card.forEach((e) => e.remove());
    //country request
    getCountryData(textBox.value);
  }
}

//function with HTML for country card
const renderCountry = function (data, className = "") {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} M people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}
      </p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

//Async API Call Function
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}?fullText=true`)
    .then((response) => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);

      return response.json();
    })
    .then((data) => {
      renderCountry(data[0]);

      //Rendering of neighbour begins
      const neighbour = data[0].borders[0];
      if (!neighbour) return;

      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then((response) => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);

      return response.json();
    })
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err) => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
