const currentDocument = document.currentScript.ownerDocument;
class userCard extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", (e) => {
      this.toggleCard();
    });
  }
  // 元素插入 DOM 时调用
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });

    // 选取模板并且克隆它。最终将克隆后的节点添加到 shadowDOM 的根节点。
    // 当前文档需要被定义从而获取引入 HTML 的 DOM 权限。
    const template = currentDocument.querySelector("#user-card-template");
    const instance = template.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    // 从元素中选取 user-id 属性
    // 注意我们要像这样指定卡片:
    // <user-card user-id="1"></user-card>
    const userId = this.getAttribute("user-id");
    // 根据 user ID 获取数据，并且使用返回的数据渲染
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.text())
      .then((response) => {
        this.render(JSON.parse(response));
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render(userData) {
    // 使用操作 DOM 的 API 来填充卡片的不同区域
    // 组件的所有元素都存在于 shadow dom 中，所以我们使用了 this.shadowRoot 这个属性来获取 DOM
    // DOM 只可以在这个子树种被查找到
    this.shadowRoot.querySelector(".card__full-name").innerHTML = userData.name;
    this.shadowRoot.querySelector(".card__user-name").innerHTML =
      userData.username;
    this.shadowRoot.querySelector(".card__website").innerHTML =
      userData.website;
    this.shadowRoot.querySelector(
      ".card__address"
    ).innerHTML = `<h4>Address</h4>
      ${userData.address.suite}, <br />
      ${userData.address.street},<br />
      ${userData.address.city},<br />
      Zipcode: ${userData.address.zipcode}`;
  }
  toggleCard() {
    let elem = this.shadowRoot.querySelector(".card__hidden-content");
    let btn = this.shadowRoot.querySelector(".card__details-btn");
    btn.innerHTML =
      elem.style.display == "none" ? "Less Details" : "More Details";
    elem.style.display = elem.style.display == "none" ? "block" : "none";
  }
}

customElements.define("user-card", userCard);
