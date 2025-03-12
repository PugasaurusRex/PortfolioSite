import { createNavBar } from "./navbar.js";

createNavBar('../../');

export function gravityGame() {
  const replace = document.getElementById("gravity-replace");
    replace.addEventListener('click', () => {
      document.getElementById('gravity-game').innerHTML = `
        <iframe
          frameborder="0"
          src="https://itch.io/embed-upload/13051787?color=333333"
          allowfullscreen=""
          width="980" height="580">
          <a href="https://pugasaurusrex.itch.io/gravity-runner">Play Gravity Runner on itch.io</a>
        </iframe>
      `;
    replace.parentNode.removeChild(replace);
  });
}

export function lastDefense() {
  const replace = document.getElementById("defense-replace");
    replace.addEventListener('click', () => {
      document.getElementById('defense').innerHTML = `
        <iframe class="game-frame" allowfullscreen="" frameborder="0" src="https://itch.io/embed-upload/3691150?color=000000" width="980" height="580">
          <a href="https://pugasaurusrex.itch.io/the-last-defense">Play The Last Defense on itch.io</a>
        </iframe>
      `;
      replace.parentNode.removeChild(replace);
  });
}