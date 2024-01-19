import { api } from "@hboictcloud/api";

interface Question {
    questionId: number;
    title: string;
    description: string;
    code: string;
    date: string;
    fullname: string;
}

async function searchQuestions(query: string): Promise<Question[]> {
    try {
        const result: any = await api.queryDatabase(
            "SELECT questions.questionId, questions.title, questions.description, questions.created_at, questions.code, user2.firstname, user2.lastname FROM questions LEFT JOIN user2 ON questions.userId=user2.id WHERE questions.title LIKE ? ORDER BY created_at DESC",
            [`%${query}%`]
        );

        if (!result || result.length === 0) {
            return [];
        }

        const resultArray: any[] = Array.isArray(result) ? result : [result];

        const matchingQuestions: Question[] = resultArray.map((question: any) => ({
            questionId: question.questionId,
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

function formatDate(dateString: string): string {
    const convertedDate: Date = new Date(dateString);
    return `${convertedDate.toDateString()} | ${
        convertedDate.getHours() - 1
    }:${convertedDate.getMinutes()}:${convertedDate.getSeconds()}`;
}

async function performSearch(event: Event): Promise<void> {
    try {
        event.preventDefault();

        const queryInput: HTMLInputElement | null = document.getElementById("search") as HTMLInputElement;
        const resultsContainer: HTMLElement | null = document.getElementById("search-results");

        if (!queryInput || !resultsContainer) {
            console.error("Input or results container not found");
            return;
        }

        const query: string = queryInput.value.trim();

        resultsContainer.innerHTML = "";

        if (query !== "") {
            // Check for invalid input (only spaces or illegal characters)
            const isValidInput: boolean = /^[a-zA-Z0-9_]+$/.test(query);

            if (isValidInput) {
                const results: Question[] = await searchQuestions(query);

                if (results.length > 0) {
                    const resultsList: HTMLUListElement = document.createElement("ul");
                    resultsList.classList.add("search-results-list");

                    results.forEach((result) => {
                        const resultItem: HTMLLIElement = document.createElement("li");

                        const link: HTMLAnchorElement = document.createElement("a");
                        link.href = `/question.html?id=${result.questionId}`;
                        link.classList.add("question-link");

                        link.innerHTML = `<div id="question-full">
                            <h1 id="question-title">${result.title}</h1>
                            <div id="question-description">${truncateDescription(result.description)}</div>
                            <pre id="question-code">${result.code}</pre>
                            <div id="question-details">${result.date} by ${result.fullname}</div>
                        </div>`;

                        const codeSection: HTMLPreElement | null = link.querySelector("#question-code");
                        if (codeSection) {
                            codeSection.textContent = result.code;
                        }

                        resultItem.appendChild(link);
                        resultsList.appendChild(resultItem);
                    });

                    resultsContainer.appendChild(resultsList);
                } else {
                    displayNoResults(resultsContainer);
                }
            } else {
                // Display message for invalid input
                const invalidInputDiv: HTMLDivElement = document.createElement("div");
                invalidInputDiv.id = "invalid-input";
                invalidInputDiv.innerText = "Invalid input. Please enter a valid search query ):<";
                resultsContainer.appendChild(invalidInputDiv);
            }
        } else {
            // Display message for empty input
            const emptyInputDiv: HTMLDivElement = document.createElement("div");
            emptyInputDiv.id = "empty-input";
            emptyInputDiv.innerText = "Please enter a search query!";
            resultsContainer.appendChild(emptyInputDiv);
        }
    } catch (error) {
        console.error(error);
    }
}

function truncateDescription(description: string): string {
    // Truncate description to show only the first line
    const lines: any = description.split("\n");
    return lines[0] + (lines.length > 1 ? "..." : "");
}

function displayNoResults(container: HTMLElement): void {
    container.innerHTML = ""; // Clear any previous content
    const noResultDiv: HTMLDivElement = document.createElement("div");
    noResultDiv.id = "noresult";
    noResultDiv.innerText = "No results found for your search ):";
    container.appendChild(noResultDiv);
}

document.addEventListener("DOMContentLoaded", () => {
    const searchForm: HTMLFormElement | null = document.getElementById("search-form") as HTMLFormElement;
    const searchResults: HTMLElement | null = document.getElementById("search-results");

    if (searchForm && searchResults) {
        const performSearchHandler: any = async (event: Event): Promise<void> => {
            await performSearch(event);

            // Check if there are search results
            const hasResults: boolean = searchResults.innerHTML.trim() !== "";

            // Toggle the 'animate-in' class based on the presence of results
            searchResults.classList.toggle("animate-in", hasResults);

            // Set the max-height property based on the actual content height
            const contentHeight: string = hasResults ? `${searchResults.scrollHeight}px` : "0";
            searchResults.style.maxHeight = hasResults ? contentHeight : "0";

            // Prevent the default form submission behavior
            event.preventDefault();
        };

        // Form submission event
        searchForm.addEventListener("submit", performSearchHandler);

        const searchButton: HTMLButtonElement | null = document.getElementById(
            "search-button"
        ) as HTMLButtonElement;

        if (searchButton) {
            // Button click event
            searchButton.addEventListener("click", performSearchHandler);

            // Handle the Enter key press on the search input
            const searchInput: HTMLInputElement | null = document.getElementById(
                "search"
            ) as HTMLInputElement;
            if (searchInput) {
                searchInput.addEventListener("keydown", (event: KeyboardEvent): void => {
                    if (event.key === "Enter") {
                        performSearchHandler(event);
                    }
                });
            }
        }
    }
});

export { searchQuestions, performSearch };
