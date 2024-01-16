import "./config";
import { api, utils } from "@hboictcloud/api";

async function getQuestions(): Promise<void> {
    try {
        const result: any = await api.queryDatabase(
            "SELECT questions.title, questions.description, questions.created_at, user2.firstname, user2.lastname FROM questions INNER JOIN user2 ON questions.userId=user2.id ORDER BY created_at DESC"
        );
        if (!result) {
            return;
        }
        if (result.length > 0) {
            const questionList: HTMLDivElement = document.querySelector("#question-list") as HTMLDivElement;
            for (let i: number = 0; i < result.length; i++) {
                const question: any = result[i];
                const questionHTML: HTMLDivElement = (
                    await utils.fetchAndParseHtml("/assets/html/question.html")
                )[0] as HTMLDivElement;
                const title: HTMLDivElement = questionHTML.querySelector("#questiontitle") as HTMLDivElement;
                const description: HTMLDivElement = questionHTML.querySelector(
                    "#questiondescription"
                ) as HTMLDivElement;
                const date: HTMLDivElement = questionHTML.querySelector("#questiondate") as HTMLDivElement;
                const fullname: HTMLDivElement = questionHTML.querySelector(
                    "#questionfullname"
                ) as HTMLDivElement;
                const converteddate: Date = new Date(question.created_at);
                const datestring: string = `${converteddate.toDateString()} |  ${converteddate.getHours()}:${converteddate.getMinutes()}:${converteddate.getSeconds()}`;

                title.innerText = question.title;
                date.innerText = datestring;
                description.innerText = question.description;
                fullname.innerText = question.firstname + " " + question.lastname;

                questionList.appendChild(questionHTML);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

getQuestions();
