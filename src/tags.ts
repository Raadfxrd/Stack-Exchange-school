import { api, session } from "@hboictcloud/api";

document.addEventListener("DOMContentLoaded", async () => {
    const loggedIn: number | null = session.get("user");

    if (!loggedIn) {
        window.location.href = "login.html";
        return;
    }

    const submitButton: HTMLButtonElement | null = document.querySelector(".question-submit");

    // Voert code uit wanneer er op de submit knop is geklikt
    if (submitButton) {
        submitButton.addEventListener("click", async (ev: MouseEvent) => {
            ev.preventDefault();

            // Haalt de title, description en tags elementen uit de input fields.
            const titleInput: HTMLTextAreaElement | null = document.getElementById(
                "title"
            ) as HTMLTextAreaElement;
            const descriptionInput: HTMLTextAreaElement | null = document.getElementById(
                "description"
            ) as HTMLTextAreaElement;
            const tagsInput: HTMLTextAreaElement | null = document.getElementById(
                "tags"
            ) as HTMLTextAreaElement;
            const codeInput: HTMLTextAreaElement | null = document.getElementById(
                "code"
            ) as HTMLTextAreaElement;

            // Checkt of alle velden zijn ingevuld
            if (!titleInput?.value || !descriptionInput?.value || !tagsInput?.value) {
                console.error("Fout: Alle velden moeten zijn ingevuld");
                return;
            }

            const descriptionValue: string = descriptionInput?.value.trim() || "None";
            const codeValue: string = codeInput?.value.trim() || "None";

            try {
                const userId: number = loggedIn;
                // Split de tags op komma's en haal witruimtes weg (door te trimmen)
                const tags: string[] = tagsInput.value.split(",").map((tag) => tag.trim());

                // Zet alle tags in de tag tabel (alleen als de tags nog niet bestaan)
                const tagIds: number[] = [];
                for (const tagName of tags) {
                    // Gebruikt SQL om te checken of de tag al bestaan
                    const existingTag: any = await api.queryDatabase(
                        "SELECT tagId FROM tag WHERE name = ?",
                        tagName
                    );

                    if (existingTag.length > 0) {
                        // Als de tag al bestaat, gebruik de tagId en zet hem niet in de database als nieuwe tag
                        tagIds.push(existingTag[0].tagId);
                    } else {
                        // Als de tag nog niet bestaat, zet de tag in de database en gebruik de nieuwe id
                        const result: any = await api.queryDatabase(
                            "INSERT INTO tag (name) VALUES (?)",
                            tagName
                        );
                        tagIds.push(result.insertId);
                    }
                }

                // Zet de vraag in de questions tabel
                const result: any = await api.queryDatabase(
                    "INSERT INTO questions (title, description, code, userId) VALUES (?, ?, ?, ?)",
                    titleInput.value,
                    descriptionValue,
                    codeValue,
                    userId
                );

                const questionId: number = result.insertId;

                // Zet de questionId en de tagId samen in de tabel questionTag
                for (const tagName of tags) {
                    await api.queryDatabase(
                        "INSERT INTO questionTag (questionId, tagName) VALUES (?, ?)",
                        questionId,
                        tagName
                    );
                }

                // Succesbericht in de console
                console.log("Vraag succesvol ingediend");

                // Wanneer vraag succesvol is ingediend, verwijs door naar de index pagina
                setTimeout(() => {
                    location.href = "/index.html";
                }, 1000);
            } catch (error) {
                console.error("Fout bij het indienen van de vraag:", error);
            }
        });
    }
});
