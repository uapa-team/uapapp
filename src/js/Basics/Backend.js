export default class Backend {
  // 1) es para despliegue
  // 2) la segunda y la tercera es para trabajar local

  // For deploy
  static backEndUrl = "https://www.ingenieria.unal.edu.co/uapapp/";

  //For development
  //static backEndUrl = "http://localhost:3000/";
  // static newBackend = "http://168.176.26.91:8002/uapapp/";

  static openLink(url) {
    window.open(this.backEndUrl + url, "_blank");
  }

  static clearLocalStorage() {
    localStorage.removeItem("username");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("type");
    window.location.reload();
  }

  static async refreshToken() {
    return await this._request(
      "POST",
      "refresh",
      {
        "Content-Type": "application/json",
      },
      {
        refresh: localStorage.getItem("refresh"),
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
    return answer;
  }

  static async sendRequest(method, path, body) {
    let request = await this._request(
      method,
      path,
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
      body
    );

    if (request.status === 401) {
      let refresh = await this.refreshToken();
      let res = await refresh.json();
      if (refresh.status === 401) {
        this.clearLocalStorage();
      }
      let newtoken = res["access"];
      localStorage.setItem("access", newtoken);
      let updatedRequest = await this._request(
        method,
        path,
        {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + newtoken,
        },
        body
      );
      return updatedRequest;
    } else {
      return request;
    }
  }

  static sendLogin(username, password) {
    return this._request(
      "POST",
      "login",
      {
        "Content-Type": "application/json",
      },
      {
        username: username,
        password: password,
      }
    );
  }
}

export const filterTreeNode = (input, child) => {
  return (
    child.props.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .indexOf(
        input
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      ) >= 0
  );
};

export const filterSelect = (input, option) => {
  if (input !== null && option.children !== null) {
    return (
      option.children
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .indexOf(
          input
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        ) >= 0
    );
  } else {
    return false;
  }
};
