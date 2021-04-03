import {
  GoogleClient,
  GoogleClientResult,
  SearchType,
} from "./../googleApi/GoogleClient";

import { ConcretePagination } from "./components/Pagination";
import { ConcreteResults } from "./components/Results";
import { Dialog, IDialog } from "./components/Dialog";

//elem active class
export const cssSelectedCls = "active";

//needed because of pagination
const defaultSRObject = {
  maxResults: 0,
  currentPage: 1,
  nextPageIndex: 0,
  previousPageIndex: 0,
};

export class SearchEngine {
  _results: ConcreteResults;
  _pagination: ConcretePagination;
  _dialog: IDialog;

  _googleClient: GoogleClient;

  _currentSearchType: SearchType;

  _searchResults: Object = {}; //holds states for all kinds of search (img and links)
  _currentQuery: string;

  _startSearchCallback: null | Function;
  _endSearchCallback: null | Function;

  constructor(startCb: Function = () => {}, endCb: Function = () => {}) {
    this._googleClient = new GoogleClient();
    this._pagination = new ConcretePagination();
    this._currentSearchType = SearchType.link;
    this._results = new ConcreteResults(SearchType.link, SearchType.image);
    this._dialog = new Dialog();
    this._startSearchCallback = startCb;
    this._endSearchCallback = endCb;
  }

  //always for new search
  public search(query: string) {
    if (!window.navigator.onLine) {
      this._dialog.show("No internet connection");
      return;
    }

    if (query.length === 0) return;

    const encodedUri = encodeURIComponent(query);

    if (this._currentQuery === encodedUri) return;

    //saved for pagination
    this._currentQuery = encodedUri;
    this._initSearchResults();

    this._startSearchCallback();

    this._search(encodedUri);
  }

  //always performs new search
  private async _search(query: string) {
    Promise.all([
      this._googleClient.search(query, SearchType.link),
      this._googleClient.search(query, SearchType.image),
    ])
      .then((results) => {
        results.forEach((response) => {
          this._saveSearchResults(response);
          this._getHtmlResults(response.items, response.type); //parses results
        });
        this._results.showLinkResults(); //primary result page
        this._initPagination();
        this._initResultTabs();

        this._endSearchCallback();
      })
      .catch((error) => {
        console.log(error);
        this._endSearchCallback();

        this._dialog.show("Service is unavailable");
      });
  }

  //pagination listener
  private _searchPage(searchType: SearchType, searchIndex: number) {
    if (!this._currentQuery || this._currentQuery.length <= 0) return;

    this._startSearchCallback();

    this._googleClient
      .search(this._currentQuery, searchType, searchIndex)
      .then((response) => {
        this._saveSearchResults(response);
        this._getHtmlResults(response.items, searchType);
        this._initPagination();

        this._endSearchCallback();
      })
      .catch((error) => {
        console.log(error);
        this._endSearchCallback();
        this._dialog.show("Service is unavailable");
      });
  }

  //enables separate pagination for img and link results, called on each search; creates and bind appropriate listeners to pagination btns
  private _initPagination() {
    const result = this._searchResults[this._results.getCurrentResult()];
    let nextPageListener, previousPageListener;

    if (result.nextPageIndex)
      nextPageListener = (function (obj, type, next) {
        return function () {
          obj._searchPage(type, next);
        };
      })(
        this,
        this._results.getCurrentResult() as SearchType,
        result.nextPageIndex
      );

    if (result.previousPageIndex)
      previousPageListener = (function (obj, type, previous) {
        return function () {
          obj._searchPage(type, previous);
        };
      })(
        this,
        this._results.getCurrentResult() as SearchType,
        result.previousPageIndex
      );

    this._pagination.create(
      previousPageListener,
      nextPageListener,
      result.currentPage
    );
  }

  //binds listeners to result tabs
  private _initResultTabs() {
    let linkListener = (function (engine: SearchEngine) {
      return function () {
        engine._results.showLinkResults();
        engine._initPagination();
      };
    })(this);

    let imgListener = (function (engine: SearchEngine) {
      return function () {
        engine._results.showImgResults();
        engine._initPagination();
      };
    })(this);

    this._results.bindTabListeners(linkListener, imgListener);
  }

  //saves info about google search result for pagination
  private _saveSearchResults(result: GoogleClientResult) {
    this._searchResults[result.type].maxResults = result.totalResults;
    this._searchResults[result.type].nextPageIndex = result.nextPage;
    this._searchResults[result.type].previousPageIndex = result.previousPage;
    this._searchResults[result.type].currentPage = Math.floor(
      result.nextPage / 10
    );
  }

  //parses search result items into html
  private _getHtmlResults(items: any[], type: SearchType) {
    if (type === SearchType.link) this._results.createLinkResults(items);
    else this._results.createImageResults(items);
  }

  private _initSearchResults() {
    this._searchResults[SearchType.link] = Object.create(defaultSRObject);
    this._searchResults[SearchType.image] = Object.create(defaultSRObject);
  }
}
