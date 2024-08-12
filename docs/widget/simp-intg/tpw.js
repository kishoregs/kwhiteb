// widget.js (third-party, conceptual implementation)
class Widget {
  constructor() {
    this.init();
  }

  init() {
    // Simulate async initialization
    setTimeout(() => {
      PubSub.publish("widgetReady");
    }, 1000);

    PubSub.subscribe("authenticate", this.authenticate.bind(this));
    console.log("Sub to Widget authentication information");
  }

  authenticate(data) {
    // Simulate authentication process
    if (data.token === "secure-token-123" && data.userId === "user-456") {
      console.log("Widget authenticated");

      this.show();
    } else {
      this.hide();
      console.log("Widget authenticatoon faled");
    }
  }

  show() {
    this.loadWidgetContent()
      .then((content) => {
        document.getElementById("widget-container").innerHTML = content;
      })
      .catch((error) => {
        console.error("Failed to load widget content:", error);
        document.getElementById("widget-container").innerHTML =
          "<div>Error loading widget content</div>";
      });
  }

  loadWidgetContent() {
    return fetch("./sw/widgethost.html").then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    });
  }

  //   show() {
  //     document.getElementById("widget-container").innerHTML =
  //       "<div>Widget Content</div>";
  //   }

  hide() {
    document.getElementById("widget-container").innerHTML = "";
  }
}

new Widget();
