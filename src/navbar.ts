import "./config";
import { utils, session, api } from "@hboictcloud/api";

const parsedHtml: NodeList = await utils.fetchAndParseHtml("/assets/html/navbar.html");

document.body.insertBefore(parsedHtml[0], document.body.firstChild);

const loggedIn: number = session.get("user");

// Doordat auto increment geen 0 kan zijn, kan je dit zo gebruiken
if (loggedIn) {
    const buttons: NodeList | null = document.querySelectorAll(".button");
    const registerBtn: Node = buttons[1];
    const loginBtn: Node = buttons[0];

    // Find the login/logout button by its HTML link
    // Change the Login text to "Logout"
    loginBtn!.textContent = "Logout";

    loginBtn!.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear(); // Clear local storage data
        location.reload();
    });
    // proberen de data op te halen uit de database
    try {
        const data: any = await api.queryDatabase(
            "SELECT firstname, lastname FROM user2 WHERE id = ?",
            loggedIn
        );
        registerBtn!.textContent = data[0].firstname + " " + data[0].lastname;

        console.log(data[0].firstname + " " + data[0].lastname);
    } catch (error) {
        console.log(error);

        // als het niet lukt de data op te halen, geef een lege array terug
    }
}
