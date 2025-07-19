// script.js - Custom daily schedule with fixed study/break/meal blocks until exam date

function addTopicField() {
  const container = document.getElementById("topicsContainer");

  const topicDiv = document.createElement("div");
  topicDiv.className = "topicBlock";

  const topicNameInput = document.createElement("input");
  topicNameInput.type = "text";
  topicNameInput.classList.add("topicName");
  topicNameInput.placeholder = "Topic Name";
  topicNameInput.required = true;

  const topicPagesInput = document.createElement("input");
  topicPagesInput.type = "number";
  topicPagesInput.classList.add("topicPages");
  topicPagesInput.placeholder = "Pages";
  topicPagesInput.required = true;

  topicDiv.appendChild(topicNameInput);
  topicDiv.appendChild(topicPagesInput);
  container.appendChild(topicDiv);
}

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

function sendNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

function generateTimetable() {
  requestNotificationPermission();

  const subject = document.getElementById("subject").value.trim();
  const examDateInput = document.getElementById("examDate").value;
  const examDate = new Date(examDateInput);

  if (!subject || !examDateInput) {
    alert("Please enter subject and exam date.");
    return;
  }

  const topicNames = document.querySelectorAll(".topicName");
  const topicPages = document.querySelectorAll(".topicPages");

  let topics = [];
  for (let i = 0; i < topicNames.length; i++) {
    const name = topicNames[i].value.trim();
    const pages = parseInt(topicPages[i].value);
    if (name && pages > 0) {
      topics.push({ name, pages });
    }
  }

  if (topics.length === 0) {
    alert("Please add at least one topic with pages.");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  examDate.setHours(0, 0, 0, 0);

  const totalDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24)) + 1;

  let topicQueue = [];
  topics.forEach(t => {
    for (let i = 0; i < t.pages; i++) {
      topicQueue.push({ name: t.name, subject });
    }
  });

  // Fill remaining with revision blocks
  const totalSlotsPerDay = 9;
  const totalStudySlots = totalSlotsPerDay * totalDays;
  const revisionQueue = topicQueue.map(t => ({ name: `Revision: ${t.name}`, subject: t.subject }));
  while (topicQueue.length < totalStudySlots) {
    topicQueue.push(revisionQueue[topicQueue.length % revisionQueue.length]);
  }

  const schedule = [
    { time: "06:00 - 07:00", session: "study" },
    { time: "07:00 - 07:15", session: "break" },
    { time: "09:00 - 09:30", session: "breakfast" },
    { time: "09:30 - 10:30", session: "study" },
    { time: "10:30 - 10:45", session: "break" },
    { time: "10:45 - 11:45", session: "study" },
    { time: "11:45 - 12:00", session: "break" },
    { time: "12:00 - 13:00", session: "study" },
    { time: "13:00 - 13:30", session: "lunch" },
    { time: "13:30 - 14:30", session: "study" },
    { time: "14:30 - 14:45", session: "break" },
    { time: "14:45 - 15:45", session: "study" },
    { time: "15:45 - 16:00", session: "break" },
    { time: "16:00 - 17:00", session: "study" },
    { time: "17:00 - 17:15", session: "break" },
    { time: "17:15 - 18:15", session: "study" },
    { time: "18:15 - 18:30", session: "break" },
    { time: "18:30 - 19:30", session: "study" },
    { time: "19:30 - 19:45", session: "break" },
    { time: "19:45 - 20:45", session: "study" },
    { time: "20:45 - 21:15", session: "dinner" }
  ];

  let timetableHTML = `<table border="1" cellspacing="0" cellpadding="5">
    <tr>
      <th>Sl.No.</th>
      <th>Date</th>
      <th>Subject</th>
      <th>Topic</th>
      <th>study</th>
      <th>Break</th>
      <th>Session</th>
    </tr>`;

  let serial = 1;
  let pageIndex = 0;

  for (let d = 0; d < totalDays; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);

    for (let slot of schedule) {
      if (slot.session === "study") {
        const topic = topicQueue[pageIndex++ % topicQueue.length];
        timetableHTML += `
          <tr>
            <td>${serial++}</td>
            <td>${date.toDateString()}</td>
            <td>${topic.subject}</td>
            <td>${topic.name}</td>
            <td>${slot.time}</td>
            <td>📘 Study</td>
          </tr>`;

        sendNotification(`Study: ${topic.subject}`, `Start topic: ${topic.name} at ${slot.time}`);

      } else {
        timetableHTML += `
          <tr>
            <td>${serial++}</td>
            <td>${date.toDateString()}</td>
            <td>-</td>
            <td>-</td>
            <td>${slot.time}</td>
            <td>☕ ${slot.session.charAt(0).toUpperCase() + slot.session.slice(1)}</td>
          </tr>`;
      }
    }
  }

  timetableHTML += `</table>`;
  document.getElementById("timetableResult").innerHTML = timetableHTML;
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}
