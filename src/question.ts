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

        const query: string = (document.getElementById("search") as HTMLInputElement).value;
        const resultsContainer: HTMLElement | null = document.getElementById("search-results");

        if (!resultsContainer) {
            console.error("Results container not found");
            return;
        }

        resultsContainer.innerHTML = "";

        if (query.trim() !== "") {
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
                        <div id="question-description">${result.description}</div>
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
                const noResultDiv: HTMLDivElement = document.createElement("div");
                noResultDiv.id = "noresult";
                noResultDiv.innerText = "No results found for your search.";

                resultsContainer.appendChild(noResultDiv);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const searchForm: HTMLFormElement | null = document.getElementById("search-form") as HTMLFormElement;

    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            performSearch(event);
        });
    }
});

export { searchQuestions, performSearch };
