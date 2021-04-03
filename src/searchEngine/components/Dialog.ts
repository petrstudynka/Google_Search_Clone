import { cssSelectedCls } from "./../SearchEngine";

const dialogEl = document.querySelector(".dialog") as HTMLElement;
const overlayEl = document.querySelector(".overlay") as HTMLElement;
const msgEl = document.querySelector(".dialog-message") as HTMLElement;
const btnEl = document.querySelector(".dialog-button .btn") as HTMLElement;

export interface IDialog {
  show(message: string): void;
  hide(): void;
}

export class Dialog implements IDialog {
  constructor() {
    btnEl.addEventListener(
      "click",
      function () {
        this.hide();
      }.bind(this)
    );
  }

  public show(message: string) {
    if (message.length < 1) return;
    msgEl.innerText = message;

    overlayEl.classList.add(cssSelectedCls);
  }

  public hide() {
    overlayEl.classList.remove(cssSelectedCls);
  }
}
