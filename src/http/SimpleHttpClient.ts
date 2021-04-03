export class SimpleHttpClient {
  public async get(url: string, queryParams: Object = {}): Promise<any> {
    if (!url || url === "")
      throw new Error("Provided url param must not be zero length.");

    const defaultHeaders = this.getDefaultHeaders();

    const parsedUrl = this.getURL(url, queryParams);

    let response = await fetch(parsedUrl, {
      method: "GET",
      headers: defaultHeaders,
    }).catch((error) => {
      throw new Error("Service is unavailable");
    });

    return await response.json();
  }

  public getURL(url: string, queryParams: Object) {
    if (Object.keys(queryParams).length === 0) return url;

    let queryString: string = "?";
    for (const [key, value] of Object.entries(queryParams)) {
      if (typeof value !== "string" && typeof value !== "number")
        throw new Error(
          `Query param ${key} value must be type string or number.`
        );

      queryString += `${key}=${value}&`;
    }

    return url + queryString.slice(0, queryString.length - 1); //removing last ampersand
  }

  public getDefaultHeaders() {
    return new Headers({
      "Content-Type": "text/plain;charset=UTF-8",
      Accept: "*/*",
      "Cache-Control": "No-Store",
    });
  }
}
