// Function to dynamically add topic+page input rows
function addTopic() {
  const wrapper = document.getElementById('topics-wrapper');

  const div = document.createElement('div');
  div.className = 'topic-entry';

  div.innerHTML = `
    <input type="text" name="topic[]" placeholder="Topic name" required />
    <input type="number" name="pages[]" placeholder="Pages" required />
  `;

  wrapper.appendChild(div);
}

// When the form is submitted
document.getElementById('timetableForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get values
  const subject = document.getElementById('subject').value;
  const topicInputs = document.getElementsByName('topic[]');
  const pageInputs = document.getElementsByName('pages[]');
  const examDate = new Date(document.getElementById('examDate').value);
  const hoursPerDay = parseInt(document.getElementById('hoursPerDay').value);

  // Extract topics and page counts
  const topics = [];
  const pages = [];

  for (let i = 0; i < topicInputs.length; i++) {
    const topic = topicInputs[i].value.trim();
    const page = parseInt(pageInputs[i].value.trim());

    if (topic !== '' && !isNaN(page)) {
      topics.push({ topic, page });
      pages.push(page);
    }
  }

  // Calculate days until exam
  const today = new Date();
  const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

  // Calculate totals
  const totalPages = pages.reduce((acc, curr) => acc + curr, 0);
  const pagesPerDay = Math.ceil(totalPages / daysLeft);

  // Display output
  let outputHTML = <h3>📘 Study Plan for <b>${subject}</b></h3>;
  outputHTML += <p><b>Total Topics:</b> ${topics.length}</p>;
  outputHTML += <p><b>Total Pages:</b> ${totalPages}</p>;
  outputHTML += <p><b>Days Until Exam:</b> ${daysLeft}</p>;
  outputHTML += <p><b>Recommended Pages Per Day:</b> ${pagesPerDay}</p>;

  outputHTML += '<hr><h4>📄 Topic Breakdown</h4><ul>';
  topics.forEach(t => {
    outputHTML += <li>${t.topic} – ${t.page} pages</li>;
  });
  outputHTML += '</ul>';

  document.getElementById('output').innerHTML = outputHTML;
});