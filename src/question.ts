document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("search-form");
    const questionResultsContainer = document.getElementById("question-list");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const input = (document.getElementById("search") as HTMLInputElement).value.toLowerCase();

        // Replace this with your actual data retrieval logic
        const matchingQuestions = await searchQuestions(input);

        // Clear previous results
        questionResultsContainer.innerHTML = "";

        if (matchingQuestions.length > 0) {
            matchingQuestions.forEach((question) => {
                const questionElement = document.createElement("div");
                questionElement.innerHTML = `
                    <h2>${question.title}</h2>
                    <p>${question.description}</p>
                    <p>${question.code}</p>
                    <p>${question.date}</p>
                    <p>${question.fullname}</p>
                `;
                questionResultsContainer.appendChild(questionElement);
            });
        } else {
            // No matching questions found
            const noResultsElement = document.createElement("p");
            noResultsElement.textContent = "No question found for your search :(";
            questionResultsContainer.appendChild(noResultsElement);
        }
    });
});

async function searchQuestions(query) {
    try {
        // Modify your database query to perform the search based on the input
        const result = await api.queryDatabase(
            "SELECT questions.questionId, questions.title, questions.description, questions.created_at, questions.code, user2.firstname, user2.lastname FROM questions LEFT JOIN user2 ON questions.userId=user2.id WHERE questions.title LIKE ? ORDER BY created_at DESC",
            [`%${query}%`]
        );

        if (!result || result.length === 0) {
            return [];
        }

        const matchingQuestions = result.map((question) => ({
            title: question.title,
            description: question.description,
            code: question.code,
            date: formatDate(question.created_at),
            fullname: question.firstname ? `${question.firstname} ${question.lastname}` : "Deleted User",
        }));

        return matchingQuestions;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function formatDate(dateString) {
    const convertedDate = new Date(dateString);
    return `${convertedDate.toDateString()} | ${
        convertedDate.getHours() - 1
    }:${convertedDate.getMinutes()}:${convertedDate.getSeconds()}`;
}
