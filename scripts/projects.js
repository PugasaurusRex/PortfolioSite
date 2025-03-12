import { createNavBar } from "./navbar.js";

createNavBar('../');

const projectGrid = document.querySelector('.project-grid');
const projectList = document.querySelector('.project-list');

const gridButton = document.querySelector('.grid-btn');
const listButton = document.querySelector('.list-btn');

projectGrid.classList.add('hidden');

gridButton.addEventListener('click', function() {
  projectGrid.classList.remove('hidden');
  projectList.classList.add('hidden');
});

listButton.addEventListener('click', function() {
  projectList.classList.remove('hidden');
  projectGrid.classList.add('hidden');
});

async function createProject(name, htmlFile) {
  return new Promise(async (resolve, reject) => {
    try {
      // Add the project to the project grid
      projectGrid.innerHTML += `
        <a class='link' href='../html/project-pages/${htmlFile}.html'>
          <div class="project-box">
            <h3>${name}</h3>
          </div>
        </a>
      `;

      // Fetch the HTML content of the project page
      const response = await fetch(`../html/project-pages/${htmlFile}.html`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${htmlFile}.html: ${response.statusText}`);
      }

      const html = await response.text();

      // Parse the fetched HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Add the project content to the project list
      const projectContainer = doc.querySelector('.project-container');
      if (projectContainer) {
        projectList.innerHTML += projectContainer.innerHTML;
      } else {
        console.warn(`No .project-container found in ${htmlFile}.html`);
      }

      // Resolve the promise to indicate completion
      resolve();
    } catch (error) {
      // Reject the promise if there's an error
      console.error(`Error creating project ${name}:`, error);
      reject(error);
    }
  });
}

async function createProjects() {
  await createProject('VR Multiplayer Shooter', 'vr-shooter');
  await createProject('VR Computer Builder', 'vr-computer-builder');
  await createProject('Dungeon Runners', 'dungeon-runners');
  await createProject('The Last Defense', 'the-last-defense');
  await createProject('Gravity Runner', 'gravity-runner');
  await createProject('Minesweeper', 'minesweeper');
  await createProject('Sudoku Solver', 'sudoku');
}

createProjects();