import { createNavBar } from "../scripts/navbar.js";

createNavBar('../');

function createExperienceItem(title, company, dateRange) {
  const experienceList = document.querySelector('.experience-list');

  const html = `
      <div class="timeline-item">
        <div class="timeline-content">
          <h2 class="timeline-item-title">${title}</h2>
          <p class="timeline-item-company">${company}</p>
          <p class="timeline-item-date">${dateRange}</p>
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

createExperienceList();