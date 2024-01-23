import hljs from "highlight.js";
import { MarkedOptions, Renderer, marked } from "marked";
import { User } from "./models/user";
import { getUserInfo } from ".";
import { api } from "@hboictcloud/api";

document.addEventListener("DOMContentLoaded", async () => {
    const renderer: Renderer = new Renderer();
    let descriptionElement: HTMLElement | null = document.getElementById("question-description");
    let codeElement: HTMLElement | null = document.getElementById("question-code");

    if (descriptionElement) {
        let descriptionText: string = descriptionElement.textContent ?? "";
        descriptionElement.innerHTML = await marked(descriptionText, { renderer: renderer } as MarkedOptions);
    }

    if (codeElement) {
        console.log(codeElement);

        let codeText: any = codeElement.innerHTML ?? "";
        console.log(codeText);

        codeElement.innerHTML = `<pre><code>${codeText}</code></pre>`;
        const firstChild: HTMLElement | null = codeElement.firstChild as HTMLElement;
        if (firstChild instanceof HTMLElement) {
            hljs.highlightElement(firstChild.firstChild as HTMLElement);
        }
    }
});

async function getQuestionDetails(): Promise<void> {
    try {
        const urlParams: any = new URLSearchParams(window.location.search);
        const questionId: any = urlParams.get("id");

        const result: any = await api.queryDatabase(
            "SELECT * FROM questions WHERE questionId = ?",
            questionId
        );

        if (!result || result.length === 0) {
            console.error("Question details not found");
            return;
        }

        const questionDetails: any = result[0];
        document.getElementById("question-title")!.innerText = questionDetails.title;
        document.getElementById("question-description")!.innerText = questionDetails.description;
        document.getElementById("question-code")!.innerText = questionDetails.code;

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
    } catch (error) {
        console.error(error);
    }
}

getQuestionDetails();
