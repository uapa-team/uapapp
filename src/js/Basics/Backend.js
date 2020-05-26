export default class Backend {
  //static backEndUrl = 'https://ingenieria.bogota.unal.edu.co/actas-api/';
  static backEndUrl = "http://localhost:3000/";

  static openLink(url) {
    window.open(this.backEndUrl + url, "_blank");
  }

  static sendRequest(method, path, body) {
    return this._request(
      method,
      path,
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body
    );
  }

  static sendLogin(username, password) {
    return this._request(
      "POST",
      "login",
      {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      {
        username: username,
        password: password,
      }
    );
  }

  static _request(method, path, headers, body) {
    let newurl = this.backEndUrl + path;
    let answer = fetch(newurl, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
    });
    answer.then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("jwt");
        window.location.reload();
      }
    });
    return answer;
  }
}
