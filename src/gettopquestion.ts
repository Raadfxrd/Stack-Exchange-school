import "./config";
import { api, utils } from "@hboictcloud/api";
import hljs from "highlight.js";

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function getQuestions(): Promise<void> {
    try {
        // Left join want je wilt alle vragen krijgen ondanks dat userId = null, Left join zorgt ervoor dat je alle vragen krijgt.
        const result: any = await api.queryDatabase(
            `SELECT questions.questionId, questions.title, questions.description, questions.created_at, questions.code, user2.firstname, user2.lastname, 
            ROUND(AVG(ratings.ratingValue), 1) as averageRating 
            FROM questions 
            LEFT JOIN user2 ON questions.userId=user2.id 
            LEFT JOIN ratings ON questions.questionId=ratings.questionId 
            GROUP BY questions.questionId 
            ORDER BY averageRating DESC`
        );

        if (!result || result.length === 0) {
            return;
        }

        const questionList: HTMLDivElement = document.querySelector("#question-list") as HTMLDivElement;

        for (let i: number = 0; i < result.length; i++) {
            const question: any = result[i];

            const questionLink: HTMLAnchorElement = document.createElement("a");
            questionLink.href = `/question.html?id=${question.questionId}`;
            questionLink.classList.add("question-link");

            const questionHTML: HTMLDivElement = (
                await utils.fetchAndParseHtml("/assets/html/questiontemplate.html")
            )[0] as HTMLDivElement;

            const title: HTMLDivElement = questionHTML.querySelector("#questiontitle") as HTMLDivElement;
            const description: HTMLDivElement = questionHTML.querySelector(
                "#questiondescription"
            ) as HTMLDivElement;
            const code: HTMLDivElement = questionHTML.querySelector("#questioncode") as HTMLDivElement;
            const date: HTMLDivElement = questionHTML.querySelector("#questiondate") as HTMLDivElement;
            const fullname: HTMLDivElement = questionHTML.querySelector(
                "#questionfullname"
            ) as HTMLDivElement;
            const rating: HTMLDivElement = questionHTML.querySelector(
                "#questionaveragerating"
            ) as HTMLDivElement;

            const converteddate: Date = new Date(question.created_at);
            const datestring: string = `${converteddate.toDateString()} | ${
                converteddate.getHours() - 1
            }:${converteddate.getMinutes()}:${converteddate.getSeconds()}`;

            title.innerText = question.title;
            date.innerText = datestring;
            description.innerText = question.description;

            if (code && question.code) {
                const escapedCode: string = escapeHtml(question.code);
                code.innerHTML = `<pre><code>${escapedCode}</code></pre>`;
                const firstChild: HTMLElement | null = code.firstChild as HTMLElement;
                if (firstChild instanceof HTMLElement) {
                    hljs.highlightElement(firstChild.firstChild as HTMLElement);
                }
            }

            if (question.averageRating !== null) {
                rating.innerText = `Average Rating: ${question.averageRating.toString()}`;
            } else {
                rating.innerText = "No ratings yet";
            }
            if (question.firstname === null) {
                fullname.innerText = "Deleted User";
            } else {
                fullname.innerText = question.firstname + " " + question.lastname;
            }
            questionLink.appendChild(questionHTML);

            questionList.appendChild(questionLink);
        }
    } catch (error) {
        console.error(error);
    }
}

getQuestions();
