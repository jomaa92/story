const input = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

input.addEventListener("keyup", async () => {
  const query = input.value.trim();

  if (!query) {
    resultsDiv.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(`/search?query=${query}`);
    const books = await response.json();

    resultsDiv.innerHTML = "";

    books.forEach(book => {



        let stars = "";

        if (book.rating) {
            for (let i = 0; i < book.rating; i++) {
            stars += "⭐ ";
            }
        } else {
            stars = "No rating";
        }


      resultsDiv.innerHTML += `
        <div>
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <p>${stars}</p>
          <hr>
        </div>
      `;
    });

  } catch (error) {
    console.error("Search error:", error);
  }
});