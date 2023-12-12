import "./config";
import { session } from "@hboictcloud/api";

// Maak een actie aan voor de logout knop. Als je hier op drukt wordt de logout functie aangeroepen
document.querySelector(".logout-btn")?.addEventListener("click", logout);
function logout(): void {
    // Verwijder de sessies
    session.remove("user");}