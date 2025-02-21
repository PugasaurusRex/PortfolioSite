const nameString = "Mark Ellis"; // Replace with your name
const nameElement = document.querySelector(".animated-name");
const summaryContainer = document.querySelector(".summary-container");
const boxContainer = document.querySelector(".box-container");
const delay = 100; // Time delay between each letter (in milliseconds)

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
  summaryContainer.classList.add("visible"); // Add the "visible" class to trigger the slide-in animation
}, nameString.length * delay + 100); // Wait for the name animation to complete plus an additional delay

setTimeout(() => {
  boxContainer.classList.add("visible"); // Add the "visible" class to trigger the slide-in animation
}, nameString.length * delay + 100); // Wait for the name animation to complete plus an additional delay