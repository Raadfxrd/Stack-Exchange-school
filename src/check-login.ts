import { session } from "@hboictcloud/api";

// checkt of user is ingelogd
function checkLoginStatus(): void {
    const loggedIn: boolean = session.get("user");

    if (!loggedIn) {
        window.location.href = "index.html";
    }
}

// Roep functie aan wanneer pagina laadt
window.addEventListener("load", checkLoginStatus);
