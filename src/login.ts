import "./config";
import { api, session, url } from "@hboictcloud/api";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
function setup(): void {
    console.log(" in setup");

    // Maak een actie aan voor de login knop. Als je hier op drukt wordt de code tussen de { } aangeroepen
    document.querySelector("#login-form")?.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Haal de waarden uit de inputvelden met het id username en password
        const username: string = (<HTMLInputElement>document.getElementById("username")).value;
        const password: string = (<HTMLInputElement>document.getElementById("password")).value;
        // Roep de loginFromDatabase functie aan (op regel 50) en geef username en password mee
        try {
            const data: any = await loginFromDatabase(username, password);
            if (data.length > 0) {
                // Maak user object aan met de waarden uit de database
                // Sla de gebruikersgegevens op in een sessie
                session.set("user", data[0].id);

                // Stuur de gebruiker door naar de homepagina
                url.redirect("index.html");
            } else {
                // Als de gebruiker niet bestaat, geef melding aan gebruiker door in de css (bootstrap) de display op block te zetten
                document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");

                // Maak de inputvelden weer leeg
                (<HTMLInputElement>document.getElementById("username")).value = "";
                (<HTMLInputElement>document.getElementById("password")).value = "";
            }
        } catch (error) {
            // als het niet lukt de data op te halen, geef de gebruiker een foutmelding
            console.log("Er is iets fout gegaan!");
        }
    });
}

/**
 *
 * @param username
 * @param password
 * @returns Array with the user data
 */
async function loginFromDatabase(username: string, password: string): Promise<Array<any> | undefined> {
    // proberen de data op te halen uit de database
    try {
        const data: any = await api.queryDatabase(
            "SELECT id FROM user WHERE username = ? AND password = ?",
            username,
            password
        );

        console.log(data);

        return data;
    } catch (error) {
        console.log(error);

        // als het niet lukt de data op te halen, geef een lege array terug
        return [];
    }
}

// Roep de setup functie aan als de pagina is geladen
setup();
