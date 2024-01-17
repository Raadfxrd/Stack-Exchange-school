import "./config";
import { utils, session, api } from "@hboictcloud/api";

const parsedHtml: NodeList = await utils.fetchAndParseHtml("/assets/html/navbar.html");

document.body.insertBefore(parsedHtml[0], document.body.firstChild);

const loggedIn: number = session.get("user");

// Doordat auto increment geen 0 kan zijn, kan je dit zo gebruiken
if (loggedIn) {
    const buttons: NodeList | null = document.querySelectorAll(".button");
    const registerBtn: HTMLAnchorElement | null = buttons[1] as HTMLAnchorElement | null;
    const loginBtn: HTMLAnchorElement | null = buttons[0] as HTMLAnchorElement | null;
    const userNameLink: HTMLAnchorElement | null = buttons[2] as HTMLAnchorElement | null;

    if (loginBtn && userNameLink) {
        loginBtn.textContent = "Logout";

        loginBtn.addEventListener("click", (e) => {
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
            const userDetailsPage: string = "userDetails.html";

            if (registerBtn) {
                registerBtn.textContent = data[0].firstname + " " + data[0].lastname;
                registerBtn.setAttribute("href", userDetailsPage);
            }

            if (userNameLink) {
                userNameLink.setAttribute("href", userDetailsPage);

                userNameLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    window.location.href = userDetailsPage;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
