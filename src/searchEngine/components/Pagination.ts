import { cssSelectedCls } from "./../SearchEngine";

const rootElem = document.querySelector(".search-paging") as HTMLElement;
const paginationList = document.querySelector(
  ".search-paging__list"
) as HTMLElement;
const previousController = document.querySelector(
  ".paging-item--previous .btn"
) as HTMLElement;
const nextController = document.querySelector(
  ".paging-item--next .btn"
) as HTMLElement;
const currentPage = document.querySelector(
  ".paging-item.selected-page"
) as HTMLElement;

/**
 * ConcretePagination for SearchEngine class
 * NOTE: could implemented an interface
 */
export class ConcretePagination {
  //needed to remove when creating new coz memory leaks
  private previousListener = null;
  private nextListener = null;

  constructor() {}

  //binds new listeners and change state - could be separated into two methods
  public create(
    previousListener?: EventListenerOrEventListenerObject,
    nextListener?: EventListenerOrEventListenerObject,
    pageNumber: number = 1
  ) {
    rootElem.classList.add("active");

    //if not called for the first time
    if (previousListener) {
      if (this.previousListener)
        previousController.removeEventListener("click", this.previousListener);

      //no listeners no active
      previousController.addEventListener("click", previousListener);
      previousController.classList.remove("btn--hidden"); //hardcoded with buttons
    } else {
      previousController.classList.add("btn--hidden");
    }

    //same for nextController
    if (this.nextListener)
      nextController.removeEventListener("click", this.nextListener);

    if (nextListener) {
      nextController.addEventListener("click", nextListener);
      nextController.classList.remove("btn--hidden");
    } else {
      nextController.classList.add("btn--hidden");
    }

    previousListener = previousListener;
    this.nextListener = nextListener;

    currentPage.innerText = pageNumber > 0 ? pageNumber.toString() : "1";
  }

  private _initTabs() {}

  public hide() {
    rootElem.classList.remove(cssSelectedCls);
  }
}
