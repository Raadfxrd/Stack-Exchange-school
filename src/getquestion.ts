// Import necessary modules and configurations
import "./config";
import { api, utils } from "@hboictcloud/api";
import { User } from "./models/user";
import { getUserInfo } from ".";

// Function to get and display questions
async function getQuestions(): Promise<void> {
    try {
        // Fetch questions from the database
        const result: any = await api.queryDatabase(
            "SELECT questions.questionId, questions.title, questions.description, questions.created_at, questions.code, user2.firstname, user2.lastname FROM questions INNER JOIN user2 ON questions.userId=user2.id ORDER BY created_at DESC"
        );

        if (!result || result.length === 0) {
            return;
        }

        // Get the question list container
        const questionList: HTMLDivElement = document.querySelector("#question-list") as HTMLDivElement;

        for (let i: number = 0; i < result.length; i++) {
            const question: any = result[i];

            // Create a clickable link for each question
            const questionLink: HTMLAnchorElement = document.createElement("a");
            questionLink.href = `/question.html?id=${question.questionId}`; // Add the question ID to the URL
            questionLink.classList.add("question-link");

            // Use the question template
            const questionHTML: HTMLDivElement = (
                await utils.fetchAndParseHtml("/assets/html/questiontemplate.html")
            )[0] as HTMLDivElement;

            // Populate question details
            const title: HTMLDivElement = questionHTML.querySelector("#questiontitle") as HTMLDivElement;
            const description: HTMLDivElement = questionHTML.querySelector(
                "#questiondescription"
            ) as HTMLDivElement;
            const code: HTMLDivElement = questionHTML.querySelector("#questioncode") as HTMLDivElement;
            const date: HTMLDivElement = questionHTML.querySelector("#questiondate") as HTMLDivElement;
            const fullname: HTMLDivElement = questionHTML.querySelector(
                "#questionfullname"
            ) as HTMLDivElement;

            const converteddate: Date = new Date(question.created_at);
            const datestring: string = `${converteddate.toDateString()} | ${
                converteddate.getHours() - 1
            }:${converteddate.getMinutes()}:${converteddate.getSeconds()}`;

            title.innerText = question.title;
            date.innerText = datestring;
            description.innerText = question.description;
            code.innerText = question.code;
            fullname.innerText = question.firstname + " " + question.lastname;

            // Append the question to the link
            questionLink.appendChild(questionHTML);

            // Append the link to the question list
            questionList.appendChild(questionLink);
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to fetch and display details of a specific question
async function getQuestionDetails(): Promise<void> {
    try {
        // Extract question ID from the URL
        const urlParams: any = new URLSearchParams(window.location.search);
        const questionId: any = urlParams.get("id");

        // Fetch details of the specific question
        const result: any = await api.queryDatabase(
            "SELECT * FROM questions WHERE questionId = ?",
            questionId
        );

        if (!result || result.length === 0) {
            console.error("Question details not found");
            return;
        }

        // Populate the HTML with question details
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

        const user: User = (await getUserInfo(userId)) as User;

        document.getElementById("question-fullname")!.innerText = user.firstname + " " + user.lastname;
    } catch (error) {
        console.error(error);
    }
}

// Execute the getQuestions function on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    getQuestions();

    // Check if it's the question.html page, then fetch and display question details
    if (window.location.pathname.includes("question.html")) {
        getQuestionDetails();
    }
});
