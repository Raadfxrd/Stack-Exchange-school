// Importeer de benodigde bibliotheken
import hljs from "highlight.js";
import { marked, Renderer } from "marked";
import { MarkedOptions } from "marked";
import { api, session } from "@hboictcloud/api";

document.addEventListener("DOMContentLoaded", async () => {
    await loadQuestionDetails();

    const form: HTMLFormElement = document.getElementById("edit-question-form") as HTMLFormElement;
    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        await saveChanges();
    });

    // Add the event listeners
    titleInput.addEventListener("keyup", updateTitleOutput);
    descriptionInput.addEventListener("keyup", updateDescriptionOutput);
    codeInput.addEventListener("keyup", updateCodeOutput);

    // Call the functions when the page loads
    updateTitleOutput();
    updateDescriptionOutput();
    updateCodeOutput();
});

async function loadQuestionDetails(): Promise<void> {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const questionId: string = urlParams.get("id") as string;

    const result: string = (await api.queryDatabase(
        "SELECT * FROM questions WHERE questionId = ?",
        questionId
    )) as string;

    if (!result || result.length === 0) {
        console.error("Question details not found");
        return;
    }

    const questionDetails: any = result[0];

    // Get the current user's ID
    const currentUserId: any = session.get("user");

    // Check if the current user is the one who created the question
    if (questionDetails.userId !== currentUserId) {
        alert("You are not authorized to edit this question");
        window.location.href = "/index.html";
        return;
    }

    (document.getElementById("question-title") as HTMLInputElement).value = questionDetails.title;
    (document.getElementById("question-description") as HTMLTextAreaElement).value =
        questionDetails.description;
    (document.getElementById("question-code") as HTMLTextAreaElement).value = questionDetails.code;

    // Call the functions after the inputs are populated
    updateDescriptionOutput();
    updateCodeOutput();
}

async function saveChanges(): Promise<void> {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const questionId: string = urlParams.get("id") as string;

    const title: string = (document.getElementById("question-title") as HTMLInputElement).value;
    const description: string = (document.getElementById("question-description") as HTMLTextAreaElement)
        .value;
    const code: string = (document.getElementById("question-code") as HTMLTextAreaElement).value;

    await api.queryDatabase(
        "UPDATE questions SET title = ?, description = ?, code = ? WHERE questionId = ?",
        title,
        description,
        code,
        questionId
    );

    alert("Changes saved successfully");
    window.location.href = `/question.html?id=${questionId}`;
}

// Haal de elementen op
const titleInput: HTMLInputElement = document.getElementById("question-title") as HTMLInputElement;
const descriptionInput: HTMLInputElement = document.getElementById(
    "question-description"
) as HTMLInputElement;
const codeInput: HTMLInputElement = document.getElementById("question-code") as HTMLInputElement;
const titleOutput: HTMLElement = document.getElementById("title-output")!;
const descriptionOutput: HTMLElement = document.getElementById("description-output")!;
const codeOutput: HTMLElement = document.getElementById("code-output")!;

titleOutput.style.display = "none";
descriptionOutput.style.display = "none"; // Verberg de uitvoervakken initieel
codeOutput.style.display = "none";

// Maak een nieuwe instantie van de Renderer klasse
const renderer: Renderer = new Renderer();

// Functie om HTML te ontsnappen
function escapeHtml(html: string): string {
    const text: Text = document.createTextNode(html);
    const div: HTMLDivElement = document.createElement("div");
    div.appendChild(text);
    return div.innerHTML;
}

async function updateTitleOutput(): Promise<void> {
    if (titleInput.value.trim() !== "") {
        titleOutput.innerHTML = await marked(titleInput.value, {
            renderer: renderer,
        } as MarkedOptions);
        titleOutput.style.display = "block";
    } else {
        titleOutput.innerHTML = "";
        titleOutput.style.display = "none";
    }
    titleInput.style.height = "auto";
    titleInput.style.height = titleInput.scrollHeight + "px";
}

console.log(titleInput);

async function updateDescriptionOutput(): Promise<void> {
    if (descriptionInput.value.trim() !== "") {
        descriptionOutput.innerHTML = await marked(descriptionInput.value, {
            renderer: renderer,
        } as MarkedOptions);
        descriptionOutput.style.display = "block";
    } else {
        descriptionOutput.innerHTML = "";
        descriptionOutput.style.display = "none";
    }
    descriptionInput.style.height = "auto";
    descriptionInput.style.height = descriptionInput.scrollHeight + "px";
}

console.log(descriptionOutput);

function updateCodeOutput(): void {
    if (codeInput.value.trim() !== "") {
        const escapedHtml: string = escapeHtml(codeInput.value);
        codeOutput.innerHTML = `<pre><code>${escapedHtml}</code></pre>`;
        const firstChild: HTMLElement | null = codeOutput.firstChild as HTMLElement;
        codeOutput.style.display = "block";
        if (firstChild instanceof HTMLElement) {
            hljs.highlightElement(firstChild.firstChild as HTMLElement);
        }
    } else {
        codeOutput.innerHTML = "";
        codeOutput.style.display = "none";
    }
    codeInput.style.height = "auto";
    codeInput.style.height = codeInput.scrollHeight + "px";
}
