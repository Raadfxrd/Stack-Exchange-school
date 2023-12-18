import "./config";
import { api } from "@hboictcloud/api";

document
    .querySelector<HTMLButtonElement>(".register-btn")
    ?.addEventListener("click", async (ev: MouseEvent) => {
        ev.preventDefault();

        const usernameInput: HTMLInputElement | null = document.getElementById(
            "username"
        ) as HTMLInputElement;
        const email: HTMLInputElement | null = document.getElementById("email") as HTMLInputElement;
        const password: HTMLInputElement | null = document.getElementById("password") as HTMLInputElement;
        const confirmPassword: HTMLInputElement | null = document.getElementById(
            "confirm-password"
        ) as HTMLInputElement;
        const firstname: HTMLInputElement | null = document.getElementById("name") as HTMLInputElement;
        const lastname: HTMLInputElement | null = document.getElementById("lastname") as HTMLInputElement;
        const usernameError: HTMLElement | null = document.getElementById("error-container-username");
        const fieldsError: HTMLElement | null = document.getElementById("error-container-fields");
        const emailError: HTMLElement | null = document.getElementById("error-container-email");
        const passwordError: HTMLElement | null = document.getElementById("error-container-password");
        const successMessage: HTMLElement | null = document.getElementById("success-message");
        const isUsernameTaken: boolean = await isUsernameAlreadyTaken(usernameInput.value);

        if (
            !usernameInput ||
            !email ||
            !password ||
            !confirmPassword ||
            !firstname ||
            !lastname ||
            !usernameError ||
            !fieldsError ||
            !emailError ||
            !passwordError ||
            !successMessage
        ) {
            console.error("Error: Missing required elements");
            return;
        }

        // Checkt of alle fields gevuld zijn
        if (
            !usernameInput.value ||
            !email.value ||
            !password.value ||
            !confirmPassword.value ||
            !firstname.value ||
            !lastname.value
        ) {
            fieldsError.style.display = "block";
            usernameError.style.display = "none";
            emailError.style.display = "none";
            successMessage.style.display = "none";
            passwordError.style.display = "none";
            return;
        }

        // Checkt of de username al reeds bestaat
        else if (isUsernameTaken) {
            usernameError.style.display = "block";
            fieldsError.style.display = "none";
            emailError.style.display = "none";
            passwordError.style.display = "none";
            successMessage.style.display = "none";
            return;
        }

        // Checkt of de email de correcte format heeft
        else if (!isValidEmail(email.value)) {
            emailError.style.display = "block";
            fieldsError.style.display = "none";
            usernameError.style.display = "none";
            passwordError.style.display = "none";
            successMessage.style.display = "none";
            return;
        }

        // Checkt of de wachtwoorden overeen komen
        else if (password.value !== confirmPassword.value) {
            passwordError.style.display = "block";
            fieldsError.style.display = "none";
            usernameError.style.display = "none";
            emailError.style.display = "none";
            successMessage.style.display = "none";
            return;
        }

        await api.queryDatabase(
            "INSERT INTO user2 (username, password, email, firstname, lastname) VALUES (?)",
            [usernameInput.value, password.value, email.value, firstname.value, lastname.value]
        );

        // Laat succes message zien
        successMessage.style.display = "block";
        passwordError.style.display = "none";
        fieldsError.style.display = "none";
        usernameError.style.display = "none";
        emailError.style.display = "none";

        setTimeout(() => {
            location.href = "/login.html";
        }, 1000);

        return;
    });

// Checkt of de username al in de database staat
async function isUsernameAlreadyTaken(username: string | undefined): Promise<boolean> {
    if (!username) {
        return false;
    }

    try {
        const result: any = await api.queryDatabase("SELECT * FROM user2 WHERE username = ?", [username]);
        return result.length > 0;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// functie die door middel van een regex checkt of de email in de juiste formaat staat.
function isValidEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
