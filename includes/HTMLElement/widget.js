// Define our customized HTMLElement 'widget' using this class.

class Widget extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Create an iframe element
    const iframe = document.createElement('iframe');
    iframe.src = this.getAttribute('src');
    iframe.style.width = this.getAttribute('width') || '300px';
    iframe.style.height = this.getAttribute('height') || '400px';
    iframe.style.border = 'none';
	iframe.style.overflow = "hidden";

    // Disable scrollbar
    iframe.style.overflow = 'hidden';

    // Apply custom CSS styles to the widget
    this.style.display = 'block';
    this.style.padding = '0';

    // Append the iframe to the shadow root
    shadow.appendChild(iframe);
  }

  static get observedAttributes() {
    return ['src', 'width', 'height'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src') {
      this.updateSrc(newValue);
    } else if (name === 'width') {
      this.updateWidth(newValue);
    } else if (name === 'height') {
      this.updateHeight(newValue);
    }
  }

  updateSrc(src) {
    const iframe = this.shadowRoot.querySelector('iframe');
    if (iframe) {
      iframe.src = src;
    }
  }

  updateWidth(width) {
    const iframe = this.shadowRoot.querySelector('iframe');
    if (iframe) {
      iframe.style.width = width || '100%';
    }
  }

  updateHeight(height) {
    const iframe = this.shadowRoot.querySelector('iframe');
    if (iframe) {
      iframe.style.height = height || '100%';
    }
  }
}

// Define 'widget'
customElements.define('x-widget', Widget);
