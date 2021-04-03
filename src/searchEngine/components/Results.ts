import { cssSelectedCls } from "./../SearchEngine";

//result
const resultsEl = document.querySelector(
  ".search .search-result"
) as HTMLElement;
const imgResultsEl = document.querySelector(
  ".search-result__img"
) as HTMLElement;
const linkResultsEl = document.querySelector(
  ".search-result__url"
) as HTMLElement;

//tabs
const rootTabEl = document.querySelector(".search-result__tabs") as HTMLElement;
const imgTabEl = document.querySelector(".tab-images") as HTMLElement;
const linkTabEl = document.querySelector(".tab-links") as HTMLElement;

export class ConcreteResults {
  private _selectedResult: string;
  private readonly _linkKey: string;
  private readonly _imageKey: string;
  private emptyResultMsg: string = "No results have been found.";

  constructor(linkResultsKey: string, imageResultsKey: string) {
    this._linkKey = linkResultsKey;
    this._imageKey = imageResultsKey;
  }

  public getCurrentResult() {
    return this._selectedResult;
  }

  public createImageResults(items: any[]) {
    ResultParser.appendResultHtmlTo(
      imgResultsEl,
      items,
      this.emptyResultMsg,
      false
    );
  }

  public createLinkResults(items: any[]) {
    ResultParser.appendResultHtmlTo(
      linkResultsEl,
      items,
      this.emptyResultMsg,
      true
    );
  }

  public showLinkResults() {
    if (!resultsEl.classList.contains(cssSelectedCls)) {
      resultsEl.classList.add(cssSelectedCls);
    }

    if (linkTabEl.classList.contains(cssSelectedCls)) return;
    imgResultsEl.classList.remove(cssSelectedCls);
    linkResultsEl.classList.add(cssSelectedCls);
    linkTabEl.classList.add(cssSelectedCls);
    imgTabEl.classList.remove(cssSelectedCls);
    this._selectedResult = this._linkKey;
  }

  public showImgResults() {
    if (!resultsEl.classList.contains(cssSelectedCls)) {
      resultsEl.classList.add(cssSelectedCls);
    }

    if (imgResultsEl.classList.contains(cssSelectedCls)) return;
    linkResultsEl.classList.remove(cssSelectedCls);
    imgResultsEl.classList.add(cssSelectedCls);
    imgTabEl.classList.add(cssSelectedCls);
    linkTabEl.classList.remove(cssSelectedCls);
    this._selectedResult = this._imageKey;
  }

  public bindTabListeners(
    linkListener: EventListenerOrEventListenerObject,
    imgListener: EventListenerOrEventListenerObject
  ) {
    if (linkListener) linkTabEl.addEventListener("click", linkListener);
    if (imgListener) imgTabEl.addEventListener("click", imgListener);
  }
}

class ResultParser {
  static appendResultHtmlTo(
    elem: HTMLElement,
    items: any[],
    emptyResultMsg: string,
    linkResult: boolean = true
  ): HTMLElement | null {
    if (!(elem instanceof HTMLElement)) return;

    let newResults = document.createElement("div");

    if (items.length > 0) {
      if (!linkResult) {
        items.forEach((item) => {
          newResults.innerHTML += `<div class="result-item">
                                    <a rel="noreferrer" target="_blank" class="result-link" href="${item.link}">
                                      <img class="result-link__img" src=${item.image.thumbnailLink} alt="${item.title}">
                                    <a/>
                                  </div>`;
        });
      } else {
        items.forEach((item) => {
          newResults.innerHTML += `<div class="result-item">
                                    <a rel="noreferrer" target="_blank" class="result-link" href="${item.link}">
                                      <div class="result-link__href">${item.displayLink}</div>
                                      <div class="result-link__title">${item.title}</div>
                                      <div class="result-link__snippet">${item.snippet}</div>
                                    </a>
                                  </div>`;
        });
      }
    } else {
      newResults.innerHTML = `<div class="result-item result-item__empty">${emptyResultMsg}<d/>`;
    }

    elem.innerHTML = newResults.innerHTML;
  }
}
