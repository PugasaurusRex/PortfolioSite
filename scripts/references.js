import { createNavBar, createFooter } from "./navbar.js";

createNavBar('../');
createFooter();

function createReference(name, relationship, currentPosition, phone, email) {
  const references = document.querySelector('.references-container');
  const html = `
    <div class="reference">
      <p class="reference-name">${name}</p>
      <p class="reference-title">${currentPosition}</p>
      <p class="reference-info"><a href="tel:+1${phone}">${phone}</a></p>
      <p class="reference-info"><a href="mailto:${email}">${email}</a></p>
    </div>
  `;

  references.innerHTML += html;
}

createReference('Doga Demirel', 'Manager at Florida Polytechnic University', 'Associate Professor at University of Oklahoma', '(405) 325-4042', 'doga@ou.edu');
createReference('Joseph Patullo', 'Manager at Avra Medical Robotics', 'Senior Systems Software Engineer at NVIDIA', '(954) 300-9321', 'joseph.patullo@gmail.com');
createReference('Kevin Calkins', 'Friend', 'Director of Institutional Research at Florida Polytechnic University', '(863) 608-7085', 'kcalkins@floridapoly.edu');
createReference('Alex Adams', 'Friend', 'Municipal Low-Income Housing Asset Management at Citi', '(863) 224-1450', 'alexanderandrewadams1@gmail.com');