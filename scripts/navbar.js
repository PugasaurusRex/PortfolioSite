export function createNavBar(linkToRoot) {
  const nav = document.querySelector('.navbar');

  if (!nav)
    return;

  nav.innerHTML = `
      <a class="nav-link" href="${linkToRoot}index">Home</a>
      <a class="nav-link" href="${linkToRoot}experience">Experience</a>
      <a class="nav-link" href="${linkToRoot}projects">Projects</a>
      <a class="nav-link" href="${linkToRoot}references">References</a>
  `;
}

export function createFooter() {
  const footer = document.querySelector('.footer');

  if (!footer)
    return;

  // Add content to the footer
  footer.innerHTML = `
    <p><a href="https://www.linkedin.com/in/mark-d-ellis/" target="_blank">LinkedIn</a></p>
    <p><a href="mailto:markde717@gmail.com">markde717@gmail.com</a></p>
    <p><a href="tel:+12392842358">(239) 284-2358</a></p>
    <p><a href="../documents/Transcript.pdf" target="_blank">Transcript</a></p>
    <p><a href="../documents/Resume.pdf" target="_blank">Resume</a></p>
  `;
}