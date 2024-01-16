// register.ts
import "./config";
import { api } from "@hboictcloud/api";

class RegistrationManager {
    // Constructor die luistert naar klik op register-knop
    public constructor() {
        document
            .querySelector<HTMLButtonElement>(".register-btn")
            ?.addEventListener("click", async (ev: MouseEvent) => {
                ev.preventDefault();
                await this.handleRegistration();
            });
    }
    // Afhandelen registratie
    private async handleRegistration(): Promise<void> {
        try {
            // Verzamelt de inputvelden uit html en foutmeldingselemeneten ook uit html
            const usernameInput: HTMLInputElement | null = document.getElementById("username") as HTMLInputElement;
            const email: HTMLInputElement | null = document.getElementById("email") as HTMLInputElement;
            const password: HTMLInputElement | null = document.getElementById("password") as HTMLInputElement;
            const confirmPassword: HTMLInputElement | null = document.getElementById("confirm-password") as HTMLInputElement;
            const firstname: HTMLInputElement | null = document.getElementById("name") as HTMLInputElement;
            const lastname: HTMLInputElement | null = document.getElementById("lastname") as HTMLInputElement;
            const usernameError: HTMLElement | null = document.getElementById("error-container-username");
            const fieldsError: HTMLElement | null = document.getElementById("error-container-fields");
            const emailError: HTMLElement | null = document.getElementById("error-container-email");
            const passwordError: HTMLElement | null = document.getElementById("error-container-password");
            const successMessage: HTMLElement | null = document.getElementById("success-message");

            // Controleert op ontbrekenede elementen
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

            // Controleert op lege invoervelden
            if (
                !usernameInput.value ||
                !email.value ||
                !password.value ||
                !confirmPassword.value ||
                !firstname.value ||
                !lastname.value
            ) {
                this.showError(fieldsError);
                return;
            }

            // Controleert of de username al in gebruik is
            if (await this.isUsernameAlreadyTaken(usernameInput.value)) {
                this.showError(usernameError);
                return;
            }

            // Controleert of de email de juiste format heeft
            if (!this.isValidEmail(email.value)) {
                this.showError(emailError);
                return;
            }

            // Checkt of wachtwoorden overeenkomen
            if (password.value !== confirmPassword.value) {
                this.showError(passwordError);
                return;
            }

            // Voert uiteindelijk de registratie uit in de database. 
            await api.queryDatabase(
                "INSERT INTO user2 (username, password, email, firstname, lastname) VALUES (?)",
                [usernameInput.value, password.value, email.value, firstname.value, lastname.value]
            );

            this.showSuccess(successMessage);

            setTimeout(() => {
                location.href = "/login.html";
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    }

    private async isUsernameAlreadyTaken(username: string | undefined): Promise<boolean> {
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

    private isValidEmail(email: string): boolean {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Toon foutmeldingen en verberg andere elementen
    private showError(errorElement: HTMLElement | null): void {
        const elementsToHide: HTMLElement[] = [
            document.getElementById("error-container-fields")!,
            document.getElementById("error-container-username")!,
            document.getElementById("error-container-email")!,
            document.getElementById("error-container-password")!,
            document.getElementById("success-message")!,
        ];
    
        elementsToHide.forEach((element) => {
            if (element && element !== errorElement) {
                element.style.display = "none";
            }
        });
    
        if (errorElement) {
            errorElement.style.display = "block";
        }
    }
    
    // Toon succesbericht en verberg andere foutmeldingen
    private showSuccess(successMessage: HTMLElement | null): void {
        const elementsToHide: HTMLElement[] = [
            document.getElementById("error-container-fields")!,
            document.getElementById("error-container-username")!,
            document.getElementById("error-container-email")!,
            document.getElementById("error-container-password")!,
        ];
    
        elementsToHide.forEach((element) => {
            if (element) {
                element.style.display = "none";
            }
        });
    
        if (successMessage) {
            successMessage.style.display = "block";
        }
    }
}
// Dit start de registratiemanager
new RegistrationManager();
