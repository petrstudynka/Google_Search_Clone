import { SearchEngine } from "./searchEngine/SearchEngine";

//hardcoded but could be solved with some stuff like DOMParser but i hope this is not key skill required in this assignment
const inputEl = document.querySelector(".search .input") as HTMLInputElement;
const btnEl = document.querySelector(".search .btn") as HTMLButtonElement;
const spinnerIcon = document.querySelector(
  ".icon.i-spinner"
) as HTMLButtonElement;
const searchIcon = document.querySelector(
  ".icon.i-search"
) as HTMLButtonElement;

const startCallback = () => {
  searchIcon.classList.add("icon--hidden");
  spinnerIcon.classList.remove("icon--hidden");
};

const endCallback = () => {
  searchIcon.classList.remove("icon--hidden");
  spinnerIcon.classList.add("icon--hidden");
};

if (inputEl && btnEl) {
  const searchEngine = new SearchEngine(startCallback, endCallback);

  btnEl.addEventListener("click", function () {
    searchEngine.search(inputEl.value);
  });

  inputEl.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) searchEngine.search(inputEl.value);
  });
}
