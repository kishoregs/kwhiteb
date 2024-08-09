class AngularWidgetLoader {
  constructor(containerSelector, bundleUrl) {
    this.containerSelector = containerSelector;
    this.bundleUrl = bundleUrl;
    this.container = null;
    this.script = null;
  }

  async load() {
    try {
      this.container = document.querySelector(this.containerSelector);
      if (!this.container) {
        throw new Error(
          `Container element not found: ${this.containerSelector}`
        );
      }

      await this.downloadBundle();
      this.injectScript();
      await this.waitForScriptLoad();
      this.initializeWidget();
    } catch (error) {
      console.error("Error loading Angular widget:", error);
      this.showErrorMessage(error.message);
    }
  }

  async downloadBundle() {
    const response = await fetch(this.bundleUrl);
    if (!response.ok) {
      throw new Error(`Failed to download bundle: ${response.statusText}`);
    }
    const bundleContent = await response.text();
    this.script = document.createElement("script");
    this.script.textContent = bundleContent;
  }

  injectScript() {
    document.body.appendChild(this.script);
  }

  waitForScriptLoad() {
    return new Promise((resolve, reject) => {
      this.script.onload = resolve;
      this.script.onerror = () =>
        reject(new Error("Failed to load the widget script"));
    });
  }

  initializeWidget() {
    if (typeof window.initAngularWidget === "function") {
      window.initAngularWidget(this.container);
    } else {
      throw new Error("Widget initialization function not found");
    }
  }

  showErrorMessage(message) {
    this.container.innerHTML = `<div class="error-message">Error: ${message}</div>`;
  }
}

// Usage example
const widgetLoader = new AngularWidgetLoader(
  "#widget-container",
  "https://example.com/widget-bundle.js"
);
widgetLoader.load();
