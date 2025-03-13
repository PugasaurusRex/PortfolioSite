import { createNavBar } from "../scripts/navbar.js";
createNavBar('../');

const experienceList = document.querySelector('.experience-list');

function createExperienceItem(title, company, dateRange) {
  const html = `
    <div class="experience-item">
      <div class='experience-header'>
        <h2 class="experience-title">${title}</h2>
        <p class="experience-company">${company}</p>
        <p class="experience-date">${dateRange}</p>
      </div>
      <div class='experience-content'>

      </div>
    </div>
  `;

  experienceList.innerHTML += html;
}

function createExperienceList() {
  createExperienceItem('Research Scientist in Computer Science', 'Florida Polytechnic University', 'February 2023 - Present');
  createExperienceItem('Software Engineer', 'Avra Medical Robotics', 'February 2022 - September 2022');
  createExperienceItem('Research Assistant in Computer Science', 'Florida Polytechnic University', 'May 2020 - April 2021');
  createExperienceItem('Bachelor\'s of Computer Science', 'Florida Polytechnic University', 'August 2018 - May 2022');
}