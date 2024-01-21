import "./config";
import { api, utils } from "@hboictcloud/api";
import { User } from "./models/user";
import { getUserInfo } from ".";

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
            code.innerText = question.code;
            code.innerText = question.code;
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

document.addEventListener("DOMContentLoaded", () => {
    getQuestions();

    if (window.location.pathname.includes("question.html")) {
        getQuestionDetails();
    }
});
