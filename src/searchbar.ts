document.addEventListener("DOMContentLoaded", () => {
    const form: HTMLFormElement = document.getElementById("search-form") as HTMLFormElement;

    form.addEventListener("submit", (event: Event) => {
        const inputElement: HTMLInputElement = document.getElementById("search") as HTMLInputElement;
        const input: string = inputElement.value.toLowerCase();

        // Append the search query as a parameter to the URL
        const queryParams: string = `?query=${encodeURIComponent(input)}`;
        const resultsPage: string = `search-results.html${queryParams}`;

        // Navigate to the results page
        window.location.href = resultsPage;

        event.preventDefault();
    });
});
