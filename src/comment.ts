import { api, session } from "@hboictcloud/api";

document.addEventListener("DOMContentLoaded", async () => {
    const loggedInUserId: number | null = session.get("user");

    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const questionId: number | null = parseInt(urlParams.get("id") || "");
    const commentsContainer: HTMLElement | null = document.getElementById("comments-list");
    const commentText: HTMLTextAreaElement | null = document.getElementById("comment") as HTMLTextAreaElement;
    const submitCommentBtn: HTMLButtonElement | null = document.querySelector(".commentsubmit");

    if (commentsContainer && commentText && submitCommentBtn) {
        async function getComments(): Promise<void> {
            try {
                if (!commentsContainer) {
                    console.error("Error: commentsContainer is null");
                    return;
                }

                const result: any = await api.queryDatabase(
                    "SELECT * FROM comments WHERE questionId = ? ORDER BY created_at DESC",
                    questionId
                );

                if (!result || result.length === 0) {
                    return;
                }

                for (let i: any = 0; i < result.length; i++) {
                    const comment: any = result[i];
                    const commentLi: HTMLLIElement = document.createElement("li");
                    commentLi.classList.add("comment-item");

                    const user: any = await api.queryDatabase(
                        "SELECT firstname, lastname FROM user2 WHERE id = ?",
                        comment.userId
                    );

                    const convertedDate: Date = new Date(comment.created_at);
                    const datestring: string = `${convertedDate.toDateString()} | ${
                        convertedDate.getHours() - 1
                    }:${convertedDate.getMinutes()}:${convertedDate.getSeconds()}`;

                    commentLi.innerHTML = `
                    <p class="comment-text">${comment.comment}</p>
                    <div class="comment-info">
                        <span class="comment-date">${datestring}</span>
                        <span class="comment-user">${user[0].firstname} ${user[0].lastname}</span>
                    </div>
                    `;

                    commentsContainer.appendChild(commentLi);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }

        getComments();

        async function submitComment(event: Event): Promise<void> {
            event.preventDefault();

            if (!commentsContainer || !commentText) {
                console.error("Error: commentsContainer or commentText is null");
                return;
            }

            const commentContent: string = commentText.value.trim();

            if (!commentContent) {
                console.error("Error: Comment cannot be empty");
                return;
            }

            try {
                await api.queryDatabase(
                    "INSERT INTO comments (questionId, userId, comment) VALUES (?, ?, ?)",
                    questionId,
                    loggedInUserId,
                    commentContent
                );

                commentText.value = "";

                commentsContainer.innerHTML = "";
                getComments();
            } catch (error) {
                console.error("Error submitting comment:", error);
            }
        }

        submitCommentBtn.addEventListener("click", submitComment);
    } else {
        console.error("One or more elements are null.");
    }
});
