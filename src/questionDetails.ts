import hljs from "highlight.js";
import { MarkedOptions, marked } from "marked";
import { User } from "./models/user";
import { api, session } from "@hboictcloud/api";
import { getUserInfo } from ".";

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

async function getQuestionDetails(): Promise<void> {
    try {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const questionId: string = urlParams.get("id") as string;

        const result: any = await api.queryDatabase(
            "SELECT * FROM questions WHERE questionId = ?",
            questionId
        );

        if (!result || result.length === 0) {
            console.error("Question details not found");
            return;
        }

        const questionDetails: any = result[0];
        // Parse markdown content and set it as the innerHTML of the question-title div
        const markdownTitle: string = await marked(questionDetails.title);
        document.getElementById("question-title")!.innerHTML = markdownTitle;

        // Parse markdown content and set it as the innerHTML of the question-description div
        const markdownDescription: string = await marked(questionDetails.description);
        document.getElementById("question-description")!.innerHTML = markdownDescription;

        let codeElement: HTMLElement | null = document.getElementById("question-code");

        if (codeElement) {
            let codeText: string = questionDetails.code ?? "";

            codeElement.innerHTML = `<pre><code>${escapeHtml(codeText)}</code></pre>`;
            const firstChild: HTMLElement | null = codeElement.firstChild as HTMLElement;
            if (firstChild instanceof HTMLElement) {
                hljs.highlightElement(firstChild.firstChild as HTMLElement);
            }
        }

        const converteddate: Date = new Date(questionDetails.created_at);
        const datestring: string = `${converteddate.toDateString()} | ${
            converteddate.getHours() - 1
        }:${converteddate.getMinutes()}:${converteddate.getSeconds()}`;

        document.getElementById("question-date")!.innerText = datestring;
        const userId: number = questionDetails.userId;

        if (questionDetails.userId === null)
            document.getElementById("question-fullname")!.innerText = "Deleted User";
        else {
            const user: User = (await getUserInfo(userId)) as User;
            document.getElementById("question-fullname")!.innerText = user.firstname + " " + user.lastname;
        }

        const currentUserId: number = session.get("user");

        // Show or hide the icons based on the ownership
        const editIcon: HTMLElement | null = document.getElementById("edit-icon");
        const deleteIcon: HTMLElement | null = document.getElementById("delete-icon");

        if (editIcon && deleteIcon) {
            if (userId === currentUserId) {
                editIcon.style.display = "inline";
                deleteIcon.style.display = "inline";

                editIcon.addEventListener("click", () => {
                    // Redirect to the edit page with the question ID
                    window.location.href = `/edit-question.html?id=${questionId}`;
                });

                deleteIcon.addEventListener("click", async () => {
                    // Confirm the deletion
                    if (!confirm("Are you sure you want to delete this question?")) {
                        return;
                    }

                    try {
                        // Delete comments linked to the question
                        await api.queryDatabase("DELETE FROM comments WHERE questionId = ?", questionId);

                        // Delete ratings linked to the question
                        await api.queryDatabase("DELETE FROM ratings WHERE questionId = ?", questionId);

                        // Delete tags linked to the question
                        await api.queryDatabase("DELETE FROM questiontag WHERE questionId = ?", questionId);

                        // Delete the question itself
                        await api.queryDatabase("DELETE FROM questions WHERE questionId = ?", questionId);

                        alert("Question and related data successfully deleted");

                        // Redirect to the index page
                        location.href = "/index.html";
                    } catch (error) {
                        console.error("Error deleting the question and related data:", error);
                    }
                });
            } else {
                editIcon.style.display = "none";
                deleteIcon.style.display = "none";
            }
        }
    } catch (error) {
        console.error(error);
    }
}

getQuestionDetails();
