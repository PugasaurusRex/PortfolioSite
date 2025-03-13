let left = true;

function createTimelineItem(title, company, dateRange, link) {
  const timelineContainer = document.querySelector('.timeline-container');

  const html = `
    <a class='link' href="experience-pages/${link}">
      <div class="timeline-item ${left ? 'left' : 'right'}">
        <div class="timeline-content">
          <h2 class="timeline-item-title">${title}</h2>
          <p class="timeline-item-company">${company}</p>
          <p class="timeline-item-date">${dateRange}</p>
        </div>
      </div>
    </a>
  `;

  timelineContainer.innerHTML += html;

  left = !left;
}

function setupTimelineAnimations() {
  const timelineItems = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
        else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.5 } // Trigger when 50% of the item is visible
  );

  // Observe each timeline item
  timelineItems.forEach((item) => {
    observer.observe(item);
  });
}

function createTimeline() {
  createTimelineItem('Research Scientist in Computer Science', 'Florida Polytechnic University', 'February 2023 - Present', 'research-scientist.html');
  createTimelineItem('Software Engineer', 'Avra Medical Robotics', 'February 2022 - September 2022', 'software-engineer.html');
  createTimelineItem('Research Assistant in Computer Science', 'Florida Polytechnic University', 'May 2020 - April 2021', 'research-assistant.html');
  createTimelineItem('Bachelor\'s of Computer Science', 'Florida Polytechnic University', 'August 2018 - May 2022', 'degree.html');

  setupTimelineAnimations();
}

createTimeline();