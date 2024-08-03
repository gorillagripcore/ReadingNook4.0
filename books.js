document.addEventListener("DOMContentLoaded", () => {
  loadCalendarEvents();
});

function loadCalendarEvents() {
  const calendarId =
    "4a4669f05d9d2911663b8c048d0088f9b1600f67c7f612d144bca15fa133b046@group.calendar.google.com";
  const apiKey = "AIzaSyB5au86SXvivbUSQIeHuTxN0VkHcYlCPE0";

  fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const events = data.items;
      const now = new Date();

      events.sort((a, b) => {
        const endA = new Date(a.end.date || a.end.dateTime);
        const endB = new Date(b.end.date || b.end.dateTime);
        return endB - endA;
      });

      const currentEvents = [];
      const upcomingEvents = [];
      const pastEvents = [];

      events.forEach((event) => {
        const eventStart = new Date(event.start.date || event.start.dateTime);
        const eventEnd = new Date(event.end.date || event.end.dateTime);

        if (eventEnd < now) {
          pastEvents.push(event);
        } else if (eventStart <= now && eventEnd >= now) {
          currentEvents.push(event);
        } else {
          upcomingEvents.push(event);
        }
      });

      loadBooks(currentEvents, "current");
      loadBooks(upcomingEvents, "upcoming");
      loadBooks(pastEvents, "past");
    })
    .catch((error) => {
      console.error("Error fetching calendar events:", error);
    });
}

function cleanBookTitle(title) {
  return title.replace(/\s*\(.*?\)\s*$/, "").trim();
}

function fetchBookInfo(bookTitle, monthYear, status) {
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      bookTitle
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.items && data.items.length > 0) {
        const englishBooks = data.items.filter(
          (item) => item.volumeInfo.language === "en"
        );

        if (englishBooks.length > 0) {
          const cleanedTitle = cleanBookTitle(englishBooks[0].volumeInfo.title);
          return {
            info: {
              ...englishBooks[0].volumeInfo,
              title: cleanedTitle,
            },
            monthYear,
            status,
          };
        }
      }
      return null;
    })
    .catch((error) => {
      console.error("Error fetching book info:", error);
      return null;
    });
}

function loadBooks(events, status) {
  const fetchPromises = events.map((event) => {
    const bookTitle = event.summary;
    const eventStart = new Date(event.start.date || event.start.dateTime);
    const monthYear = eventStart.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    return fetchBookInfo(bookTitle, monthYear, status);
  });

  Promise.all(fetchPromises)
    .then((books) => {
      books.forEach((book) => {
        if (book) {
          displayBook(book.info, book.monthYear, book.status);
        }
      });
    })
    .catch((error) => {
      console.error("Error processing book info:", error);
    });
}

function displayBook(book, monthYear, status) {
  const sectionId = {
    upcoming: "upcoming-books-container",
    current: "current-books-container",
    past: "past-books-container",
  }[status];

  const bookContainer = document.getElementById(sectionId);
  const bookElement = document.createElement("div");

  let bookInfo;

  switch (status) {
    case "upcoming":
      bookInfo = `
             <div class="book_upcoming">
              <p>${monthYear}</p>
              <img src="${
                book.imageLinks?.thumbnail || "default-thumbnail.jpg"
              }" alt="${book.title} cover">
              <p>${book.title}</p>
              <p>by</p>
              <p><em>${book.authors.join(", ")}</em></p>
             </div>
            `;
      break;
    case "current":
      bookInfo = `
            <div class="book_current">
              <p>${monthYear}</p>
              <img src="${
                book.imageLinks?.thumbnail || "default-thumbnail.jpg"
              }" alt="${book.title} cover">
              <p>${book.title} by <em>${book.authors.join(", ")}</em></p>
             </div>
          `;
      break;
    case "past":
      bookInfo = `
             <div class="book_past">
                <p>${monthYear}</p>
                <img src="${
                  book.imageLinks?.thumbnail || "default-thumbnail.jpg"
                }" alt="${book.title} cover">
                 <p>${book.title}</p>
                 <p>by</p>
                 <p><em>${book.authors.join(", ")}</em></p>
              </div>
              `;
      break;
  }

  bookElement.innerHTML = bookInfo;
  bookContainer.appendChild(bookElement);
}
