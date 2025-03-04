export function createNavBar(linkToRoot) {
  const nav = document.querySelector('.navbar');

  if (!nav)
    return;

  const html = `
      <a class="nav-link" href="${linkToRoot}index.html">Home</a>
      <a class="nav-link" href="${linkToRoot}/html/experience.html">Experience</a>
      <a class="nav-link" href="${linkToRoot}/html/projects.html">Projects</a>
      <a class="nav-link" href="${linkToRoot}/html/references.html">References</a>
  `;

  nav.innerHTML = html;
}