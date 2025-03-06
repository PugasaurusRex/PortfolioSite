import { createNavBar } from "./navbar.js";

createNavBar('../');

const projectGrid = document.querySelector('.project-grid');

function createProject(name, htmlFile) {
  projectGrid.innerHTML += `
    <a class='link' href='../html/project-pages/${htmlFile}.html'>
      <div class="project-box">
        <h3>${name}</h3>
      </div>
    </a>
  `;
}

createProject('VR Shooting Range', 'vr-shooting-range');
createProject('VR Computer Builder', 'vr-computer-builder');
createProject('Dungeon Runners', 'dungeon-runners');
createProject('The Last Defense', 'the-last-defense');
createProject('Gravity Runner', 'gravity-runner');
createProject('Minesweeper', 'minesweeper');
createProject('Sudoku Solver', 'sudoku');