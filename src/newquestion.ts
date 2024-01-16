// Importeer benodigde functionaliteit van de API-module en sessiebeheer
import { api, session } from "@hboictcloud/api";

// Voer code uit wanneer de DOM geladen is
document.addEventListener("DOMContentLoaded", async () => {
    // Controleer of de gebruiker is ingelogd door de gebruikers-ID uit de sessie te halen
    const loggedIn: number | null = session.get("user");

    // Als de gebruiker niet is ingelogd, doorverwijzen naar de inlogpagina en stop de uitvoering van de code
    if (!loggedIn) {
        window.location.href = "login.html";
        return;
    }

    // Selecteer de verzendknop en voeg een gebeurtenisluisteraar toe
    const submitButton: HTMLButtonElement | null = document.querySelector(".question-submit");

    // Voer de rest van de code uit wanneer de verzendknop wordt geklikt
    if (submitButton) {
        submitButton.addEventListener("click", async (ev: MouseEvent) => {
            ev.preventDefault();

            // Haal referenties naar de invoervelden op
            const titleInput: HTMLTextAreaElement | null = document.getElementById(
                "title"
            ) as HTMLTextAreaElement;
            const descriptionInput: HTMLTextAreaElement | null = document.getElementById(
                "description"
            ) as HTMLTextAreaElement;
            const codeInput: HTMLTextAreaElement | null = document.getElementById(
                "code"
            ) as HTMLTextAreaElement;

            // Controleer of alle vereiste invoervelden beschikbaar zijn
            if (!titleInput || !descriptionInput) {
                console.error("Fout: Ontbrekende vereiste elementen");
                return;
            }

            // Valideer of alle velden zijn ingevuld
            if (!titleInput.value || !descriptionInput.value) {
                console.error("Fout: Alle velden moeten zijn ingevuld");
                return;
            }

            try {
                // Ga verder met de rest van de code voor het indienen van een nieuwe vraag...
                const userId: number = loggedIn; // Ga ervan uit dat de gebruikers-ID beschikbaar is voor ingelogde gebruikers
                await api.queryDatabase(
                    "INSERT INTO questions (title, description, code, userId) VALUES (?, ?, ?, ?)",
                    titleInput.value,
                    descriptionInput.value,
                    codeInput.value,
                    userId
                );

                // Succesbericht
                console.log("Vraag succesvol ingediend");

                // Optioneel: doorverwijzen of andere acties uitvoeren na een succesvolle indiening
                setTimeout(() => {
                    location.href = "/index.html";
                }, 1000);
            } catch (error) {
                console.error("Fout bij het indienen van de vraag:", error);
            }
        });
    }
});
