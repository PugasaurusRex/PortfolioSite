const nameString = "Mark Ellis"; // Replace with your name
const nameElement = document.querySelector('.animated-name');
const summaryContainer = document.querySelector('.summary-container');
const contactContainer = document.querySelector('.contact-container');
const skillsContainer = document.querySelector('.skills-container');
const boxContainer = document.querySelector('.box-container');
const delay = 50; // Time delay between each letter (in milliseconds)

// Split the name into individual characters and wrap them in <span> tags
const characters = nameString.split("").map((char, index) => {
  const span = document.createElement("span");
  span.textContent = char === " " ? "\u00A0" : char; // Replace spaces with non-breaking spaces
  span.style.animationDelay = `${index * delay}ms`; // Stagger the animation for each character
  return span;
});

// Append the characters to the name element
characters.forEach(char => nameElement.appendChild(char));

// Wait for the name animation to finish, then slide in the boxes and summary
setTimeout(() => {
  // Add the "visible" class to trigger the slide-in animation
  summaryContainer.classList.add("visible");
  contactContainer.classList.add("visible");
  skillsContainer.classList.add("visible");
  boxContainer.classList.add("visible");
}, nameString.length * delay + 100); // Wait for the name animation to complete plus an additional delay

function createSkillsSection(skills){
  let html = '';

  skills.forEach((skill) => {
    if (html != '')
      html += ' &#8226; ';
    else
      html += '<p class=\'skills\'>';

    html += skill;
  });

  html += '</p>';
  skillsContainer.innerHTML += html;
}

createSkillsSection(['C#', 'Python', 'C/C++', 'Unity 3D', 'Unreal Engine 5', 'Git', 'GitHub', 'Doxygen', 'Figma', 'Linux', 'Blender 3D', 
  'Haptics', 'Research', 'Simulations', 'Virtual Reality', 'Prototyping', 'gRPC', 'Visual Studio', 'HTML', 'CSS', 'JavaScript']);

if (window.location.pathname.includes("index")) {
  window.location.pathname = ""
}