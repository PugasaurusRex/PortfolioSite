import { createNavBar } from "./navbar.js";

createNavBar('../');

const projectGrid = document.querySelector('.project-grid');

function createProject(name) {
  projectGrid.innerHTML += `
    <div class="project-box">
      <h3>${name}</h3>
    </div>
  `;
}

createProject('Project');
createProject('Project');
createProject('Project');
createProject('Project');
createProject('Project');
createProject('Project');
createProject('Project');