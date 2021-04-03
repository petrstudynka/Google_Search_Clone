const engineId = "!!! insert your engine id here !!!";
const apiKey = "!!! insert you api key here !!!";
const apiUrl = "https://www.googleapis.com/customsearch/v1";

const defaultQueryParams: GoogleQueryParams = {
  key: apiKey,
  cx: engineId,
  q: "",
  start: 1,
};

import { SimpleHttpClient } from "./../http/SimpleHttpClient";

export class GoogleClient {
  private _client: SimpleHttpClient;
  private _queryParams = defaultQueryParams;

  constructor() {
    this._client = new SimpleHttpClient();
  }

  public search(
    encodedQuery: string,
    type: string,
    startIndex: number = 1
  ): Promise<GoogleClientResult> {
    if (!Object.values(SearchType).includes(type as SearchType))
      throw new Error("Invalid Search Type provided");

    this._queryParams.q = encodedQuery;
    this._queryParams.start =
      typeof startIndex === "number" && startIndex > 0 ? startIndex : 1;

    switch (type) {
      case SearchType.link: {
        return this.searchLinks();
      }

      case SearchType.image: {
        return this.searchImages();
      }
      default:
        throw new Error("Undefined search type"); //should not happen
    }
  }

  public async searchImages(): Promise<GoogleClientResult> {
    const GoogleClientResult = getEmptyGoogleClientResult(SearchType.image);
    this._queryParams.searchType = SearchType.image;

    let apiResponse = await this._client
      .get(apiUrl, this._queryParams)
      .then((result) => {
        return new Promise<GoogleClientResult>((resolve, reject) => {
          let imageCollection = [];

          if (!result.items || !(result.items.length > 0))
            resolve(GoogleClientResult);

          //transformating results into dto
          result.items.forEach((element) => {
            imageCollection.push({
              title: element.title,
              link: element.link,
              image: {
                contextLink: element.image.contextLink,
                height: element.image.height,
                width: element.image.width,
                thumbnailLink: element.image.thumbnailLink,
              },
            });
          });

          GoogleClientResult.items = imageCollection;
          GoogleClientResult.totalResults =
            result.searchInformation.totalResults;

          if (result.queries.nextPage)
            GoogleClientResult.nextPage = result.queries.nextPage[0].startIndex;

          if (result.queries.previousPage)
            GoogleClientResult.previousPage =
              result.queries.previousPage[0].startIndex;

          resolve(GoogleClientResult);
        });
      });

    return apiResponse;
  }

  public async searchLinks(): Promise<GoogleClientResult> {
    const GoogleClientResult = getEmptyGoogleClientResult(SearchType.link);
    delete this._queryParams.searchType;

    let apiResponse = await this._client
      .get(apiUrl, this._queryParams)
      .then((result) => {
        return new Promise<GoogleClientResult>((resolve, reject) => {
          let linkCollection = [];

          if (!result.items || !(result.items.length > 0))
            return resolve(GoogleClientResult);

          //transformating results into dto
          result.items.forEach((element) => {
            linkCollection.push({
              title: element.title,
              snippet: element.snippet,
              link: element.link,
              displayLink: element.displayLink,
            });
          });

          GoogleClientResult.items = linkCollection;
          GoogleClientResult.totalResults =
            result.searchInformation.totalResults;

          if (result.queries.nextPage)
            GoogleClientResult.nextPage = result.queries.nextPage[0].startIndex;

          if (result.queries.previousPage)
            GoogleClientResult.previousPage =
              result.queries.previousPage[0].startIndex;

          resolve(GoogleClientResult);
        });
      });

    return apiResponse;
  }
}

export enum SearchType {
  link = "link",
  image = "image",
}

function getEmptyGoogleClientResult(
  searchType: SearchType
): GoogleClientResult {
  return {
    type: searchType,
    items: [],
    totalResults: 0,
    nextPage: undefined,
    previousPage: undefined,
  };
}

interface GoogleQueryParams {
  key: string;
  cx: string;
  q: string;
  start?: number;
  searchType?: SearchType;
}

export interface GoogleClientResult {
  type?: SearchType;
  items: ImageResult[] | LinkResult[];
  totalResults: number;
  nextPage: number;
  previousPage: number;
}

interface ImageResult {
  title: string;
  link: string;
  image: {
    contextLink: string;
    height: number;
    width: number;
    thumbnailLink: string;
  };
}

interface LinkResult {
  title: string;
  snippet: string;
  link: string;
  displayLink: string;
}
