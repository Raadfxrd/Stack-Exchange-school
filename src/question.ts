import { api } from "@hboictcloud/api";
import hljs from "highlight.js";
import { MarkedOptions, marked } from "marked";

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code: any, language: any) {
        const validLanguage: any = hljs.getLanguage(language) ? language : "plaintext";
        return hljs.highlight(validLanguage, code).value;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
} as MarkedOptions);

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

interface Question {
    questionId: number;
    title: string;
    description: string;
    code: string;
    date: string;
    fullname: string;
    averageRating: number | string;
}
document.documentElement.style.overflow = "hidden";
async function searchQuestions(query: string): Promise<Question[]> {
    try {
        const result: any = await api.queryDatabase(
            `SELECT questions.questionId, questions.title, questions.description, questions.created_at, questions.code, user2.firstname, user2.lastname, 
            ROUND(AVG(ratings.ratingValue), 1) as averageRating 
            FROM questions 
            LEFT JOIN user2 ON questions.userId=user2.id 
            LEFT JOIN ratings ON questions.questionId=ratings.questionId 
            WHERE questions.title LIKE ? 
            GROUP BY questions.questionId 
            ORDER BY created_at DESC`,
            [`%${query}%`]
        );

        if (!result || result.length === 0) {
            return [];
        }

        const resultArray: any[] = Array.isArray(result) ? result : [result];

        const matchingQuestions: Question[] = resultArray.map((question: any) => {
            let questionObj: Question = {
                questionId: question.questionId,
                title: question.title,
                description: question.description,
                code: question.code,
                date: formatDate(question.created_at),
                fullname: question.firstname ? `${question.firstname} ${question.lastname}` : "Deleted User",
                averageRating:
                    question.averageRating !== null
                        ? `Average rating: ${question.averageRating}`
                        : "No ratings yet",
            };

            return questionObj;
        });

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
            const isValidInput: boolean = /^[a-zA-Z0-9_]+$/.test(query);

            if (isValidInput) {
                const results: Question[] = await searchQuestions(query);

                if (results.length > 0) {
                    const resultsList: HTMLUListElement = document.createElement("ul");
                    resultsList.classList.add("search-results-list");

                    await Promise.all(
                        results.map(async (result) => {
                            const resultItem: HTMLLIElement = document.createElement("li");

                            const link: HTMLAnchorElement = document.createElement("a");
                            link.href = `/question.html?id=${result.questionId}`;
                            link.classList.add("question-link");

                            const markdownTitle: string = await marked(result.title);
                            const markdownDescription: string = await marked(result.description);
                            const finalDescription: string = truncateDescription(markdownDescription);

                            link.innerHTML = `<div id="question-full">
                            <h1 id="question-title">${markdownTitle}</h1>
                            <div id="question-description">${finalDescription}</div>
                            <div id="question-code"></div>
                            <div id="question-details">${result.date} by ${result.fullname}</div>
                            <div id="question-average-rating">${result.averageRating}</div>
                        </div>`;

                            const truncatedCode: string = truncateCode(result.code);

                            const codeSection: HTMLDivElement | null = link.querySelector("#question-code");
                            if (codeSection) {
                                codeSection.textContent = truncatedCode;
                                if (truncatedCode) {
                                    const escapedCode: string = escapeHtml(truncatedCode);
                                    codeSection.innerHTML = `<pre><code>${escapedCode}</code></pre>`;
                                    const firstChild: HTMLElement | null =
                                        codeSection.firstChild as HTMLElement;
                                    if (firstChild instanceof HTMLElement) {
                                        hljs.highlightElement(firstChild.firstChild as HTMLElement);
                                    }
                                }
                            }

                            resultItem.appendChild(link);
                            resultsList.appendChild(resultItem);
                        })
                    );

                    resultsContainer.appendChild(resultsList);
                } else {
                    displayNoResults(resultsContainer);
                }
            } else {
                const invalidInputDiv: HTMLDivElement = document.createElement("div");
                invalidInputDiv.id = "invalid-input";
                invalidInputDiv.innerText = "Invalid input. Please enter a valid search query ):<";
                resultsContainer.appendChild(invalidInputDiv);
            }
        } else {
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
    const maxLength: number = 150;
    if (description.length <= maxLength) {
        return description;
    } else {
        return description.substring(0, maxLength) + "...";
    }
}

function truncateCode(code: string): string {
    const maxLines: number = 15;
    const lines: string[] = code.split("\n");
    const truncatedCode: string = lines.slice(0, maxLines).join("\n");
    return lines.length <= maxLines ? code : truncatedCode + "...";
}

function displayNoResults(container: HTMLElement): void {
    container.innerHTML = "";
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

            // Change overflow to auto only if there's more content than the screen can display
            setTimeout(() => {
                const style: CSSStyleDeclaration = window.getComputedStyle(searchResults);
                const marginTop: number = parseInt(style.marginTop);
                const marginBottom: number = parseInt(style.marginBottom);
                if (searchResults.offsetHeight + marginTop + marginBottom < searchResults.scrollHeight) {
                    document.documentElement.style.overflow = "auto";
                } else {
                    document.documentElement.style.overflow = "hidden";
                }
            }, 0);

            event.preventDefault();
        };

        searchForm.addEventListener("submit", performSearchHandler);

        const searchButton: HTMLButtonElement | null = document.getElementById(
            "search-button"
        ) as HTMLButtonElement;

        if (searchButton) {
            searchButton.addEventListener("click", performSearchHandler);

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
