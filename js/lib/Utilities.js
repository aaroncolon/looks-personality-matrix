class Utilities {
  /**
   * Make a POST request using Fetch
   *
   * @param {String} url the url
   * @param {Object} data the data to POST
   * @return {Object} Promise object
   */
  static async postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      // mode: 'same-origin',
      // cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: this.buildQuery(data)
    });
    return await response.json();
  };

  /**
   * Build a query string from on input object
   *
   * @param {Object} data key-value pairs to transform into a string
   * @return {String} query formated string
   */
  static buildQuery(data) {
    if (typeof data === 'string') return data;

    const query = [];

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
    }

    return query.join('&');
  };

}

export default Utilities;
