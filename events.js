const apiKey = "key"; //Ask alex :^)
const calendarId =
  "976f0493b621b2cdc4e5db1be371fb467ea6d6286b5a9dcafefbd9a9172cf009@group.calendar.google.com";
const maxResults = 10;

function fetchEvents() {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&maxResults=${maxResults}&orderBy=startTime&singleEvents=true`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const events = data.items;
      const eventsContainer = document.getElementById("events");

      events.forEach((event) => {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event");

        const eventTitle = document.createElement("h3");
        eventTitle.textContent = event.summary;

        const starImage = document.createElement("img");
        starImage.src = "img/star_div.png";
        starImage.alt = "Star Image";
        starImage.classList.add("star-image");

        eventElement.appendChild(eventTitle);
        eventElement.appendChild(starImage);

        const startDate = new Date(event.start.dateTime || event.start.date);
        const endDate = new Date(event.end.dateTime || event.end.date);

        const dateOptions = { weekday: "long", day: "numeric", month: "long" };
        const timeOptions = { hour: "2-digit", minute: "2-digit" };

        const eventDateTime = document.createElement("p");
        if (
          startDate.toDateString() === endDate.toDateString() ||
          !event.start.dateTime
        ) {
          eventDateTime.innerHTML = `<strong>Date:</strong> ${startDate.toLocaleDateString(
            "en-GB",
            dateOptions
          )} at ${startDate.toLocaleTimeString("en-GB", timeOptions)}`;
        } else {
        }
        eventElement.appendChild(eventDateTime);

        const eventLocation = document.createElement("p");
        eventLocation.innerHTML = `<strong>Location:</strong> ${
          event.location || "TBA"
        }`;
        eventElement.appendChild(eventLocation);

        const eventDescription = document.createElement("p");
        eventDescription.textContent = event.description || "";
        eventElement.appendChild(eventDescription);

        eventsContainer.appendChild(eventElement);
      });
    })
    .catch((error) => console.error("Error fetching events:", error));
}

document.addEventListener("DOMContentLoaded", fetchEvents);
