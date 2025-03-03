document.addEventListener("DOMContentLoaded", function () {
  const timelineItems = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Stop observing once the item is visible
        }
      });
    },
    { threshold: 0.5 } // Trigger when 50% of the item is visible
  );

  // Observe each timeline item
  timelineItems.forEach((item) => {
    observer.observe(item);
  });
});

let left = true;
function createTimelineItem(title, company, dateRange) {
  const timelineContainer = document.querySelector('.timeline-container');

  const html = `
    <div class="timeline-item ${left ? 'left' : 'right'}">
      <div class="timeline-content">
        <h2 class="timeline-item-title">${title}</h2>
        <p class="timeline-item-company">${company}</p>
        <p class="timeline-item-date">${dateRange}</p>
      </div>
    </div>
  `;

  timelineContainer.innerHTML += html;

  left = !left;
}

createTimelineItem('Research Scientist (Computer Science)', 'Florida Polytechnic University', 'February 2023 - Present');
createTimelineItem('Software Engineer', 'Avra Medical Robotics', 'February 2022 - September 2022');
createTimelineItem('Research Assistant', 'Florida Polytechnic University', 'May 2020 - April 2021');