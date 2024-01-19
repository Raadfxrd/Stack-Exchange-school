import { api } from "@hboictcloud/api";

interface Question {
    title: string;
    description: string;
    code: string;
    date: string;
    fullname: string;
}

async function searchQuestions(query: string): Promise<Question[]> {
    try {
        const result: any = await api.queryDatabase(
            "SELECT questions.questionId, questions.title, questions.description, questions.created_at, questions.code, user2.firstname, user2.lastname FROM questions LEFT JOIN user2 ON questions.userId=user2.id WHERE questions.title LIKE ? ORDER BY created_at DESC",
            [`%${query}%`]
        );

        if (!result || result.length === 0) {
            return [];
        }

        const resultArray: any[] = Array.isArray(result) ? result : [result];

        const matchingQuestions: Question[] = resultArray.map((question: any) => ({
            title: question.title,
            description: question.description,
            code: question.code,
            date: formatDate(question.created_at),
            fullname: question.firstname ? `${question.firstname} ${question.lastname}` : "Deleted User",
        }));

        return matchingQuestions;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function formatDate(dateString: string): string {
    const convertedDate: Date = new Date(dateString);
    return `${convertedDate.toDateString()} | ${
        convertedDate.getHours() - 1
    }:${convertedDate.getMinutes()}:${convertedDate.getSeconds()}`;
}

export { searchQuestions };
