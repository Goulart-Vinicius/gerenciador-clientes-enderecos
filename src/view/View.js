class View {
  constructor(parentNode) {
    this._$parent = $(parentNode);
  }

  template() {
    return "";
  }

  render() {
    try {
      const html = this.template();
      this._$parent.html(html);

      return true;
    } catch (error) {
      console.error("Render error:", error);
      return false;
    }
  }

  _setEvents() {}
}

