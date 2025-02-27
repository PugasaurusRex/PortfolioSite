function createNavBar() {
  const nav = document.querySelector('.navbar');
  const html = `
      <a class="nav-link" href="index.html">Home</a>
      <a class="nav-link" href="experience.html">Experience</a>
      <a class="nav-link" href="projects.html">Projects</a>
      <a class="nav-link" href="contact.html">Contact</a>
      <a class="nav-link" href="references.html">References</a>
  `;

  nav.innerHTML = html;
}

createNavBar();