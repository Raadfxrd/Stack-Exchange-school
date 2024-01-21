import { api, session } from "@hboictcloud/api";

document.addEventListener("DOMContentLoaded", async () => {
    const loggedInUserId: number | null = session.get("user");

    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const questionId: number | null = parseInt(urlParams.get("id") || "");

    const ratingForm: HTMLFormElement = document.getElementById("ratingForm") as HTMLFormElement;

    ratingForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const ratingInput: HTMLInputElement = (event.target as HTMLFormElement).elements.namedItem(
            "rating"
        ) as HTMLInputElement;
        const rating: string = ratingInput.value;

        await submitRating(rating);
    });

    async function updateAverageRating(): Promise<void> {
        const ratings: any = (await api.queryDatabase(
            "SELECT ratingValue FROM ratings WHERE questionId = ?",
            questionId
        )) as any[];

        const ratingDisplay: any = document.getElementById("question-average-rating");
        if (!ratingDisplay) {
            console.error("ratingDisplay is null");
            return;
        }

        ratingDisplay.innerHTML = "";

        const ratingText: any = document.createElement("div");
        ratingText.id = "ratingText";

        if (ratings.length === 0) {
            ratingText.textContent = "No ratings submitted yet.";
        } else {
            const sum: number = ratings.reduce(
                (a: number, b: { ratingValue: number }) => a + b.ratingValue,
                0
            );
            const averageRating: number = sum / ratings.length;

            ratingText.textContent = `Average Rating: ${averageRating.toFixed(1)}`;
        }

        ratingDisplay.appendChild(ratingText);
    }

    async function submitRating(rating: string): Promise<void> {
        if (!loggedInUserId || !questionId) {
            alert("You must be logged in to submit a rating.");
            return;
        }

        try {
            await api.queryDatabase(
                "INSERT INTO ratings (questionId, userId, ratingValue) VALUES (?, ?, ?)",
                questionId,
                loggedInUserId,
                rating
            );

            await updateAverageRating();

            alert(`Submitted rating: ${rating}`);
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    }

    window.addEventListener("DOMContentLoaded", updateAverageRating);
});
