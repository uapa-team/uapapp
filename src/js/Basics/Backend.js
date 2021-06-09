export default class Backend {
  static backEndUrl = "https://www.ingenieria.bogota.unal.edu.co/uapapp_api/";
  //static backEndUrl = "http://localhost:3000/";
  static newBackend = "http://168.176.26.91:8002/uapapp/";

  static openLink(url) {
    window.open(this.backEndUrl + url, "_blank");
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
        localStorage.removeItem("type");
        window.location.reload();
      }
    });
    return answer;
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

  static check_session() {
    let newurl = this.backEndUrl + "check_session";
    let answer = fetch(newurl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ username: localStorage.getItem("username") }),
    }).catch(function (error) {
      localStorage.removeItem("username");
      localStorage.removeItem("type");
      localStorage.removeItem("jwt");
      window.location.reload();
    });

    answer.then((res) => {
      if (res.status !== 200) {
        localStorage.removeItem("username");
        localStorage.removeItem("type");
        localStorage.removeItem("jwt");
        window.location.reload();
      }
    });
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
