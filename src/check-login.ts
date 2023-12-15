import { session } from "@hboictcloud/api";

// Function to check if the user is logged in
function checkLoginStatus(): void {
    const loggedIn: boolean = session.get("user");

    if (loggedIn) {
        window.location.href = "index.html";
    }
}

// Call the function when the page loads
window.addEventListener("load", checkLoginStatus);
