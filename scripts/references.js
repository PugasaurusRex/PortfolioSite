import { createNavBar } from "./navbar.js";

createNavBar('../');

function createReference(name, relationship, currentPosition, phone, email) {
  const references = document.querySelector('.references-container');
  const html = `
    <div class="reference">
      <div class="reference-name-row"><p class="reference-name">${name}</p></div>
      <div class="reference-info-row">
        <p class="reference-title">Relationship:</p>
        <p class="reference-info">${relationship}</p>
      </div>
      <div class="reference-info-row">
        <p class="reference-title">Current Position:</p>
        <p class="reference-info">${currentPosition}</p>
      </div>
      <div class="reference-info-row">
        <p class="reference-title">Phone:</p>
        <p class="reference-info">${phone}</p>
      </div>
      <div class="reference-info-row">
        <p class="reference-title">Email:</p>
        <p class="reference-info">${email}</p>
      </div>
    </div>
  `;

  references.innerHTML += html;
}

createReference('Doga Demirel', 'Manager at Florida Polytechnic University', 'Associate Professor at University of Oklahoma', '(405) 325-4042', 'doga@ou.edu');
createReference('Joseph Patullo', 'Manager at Avra Medical Robotics', 'Senior Systems Software Engineer at NVIDIA', '(954) 300-9321', 'joseph.patullo@gmail.com');
createReference('Alex Adams', 'Friend', 'Municipal Low-Income Housing Asset Management at Citi', '(863) 224-1450', 'alexanderandrewadams1@gmail.com');