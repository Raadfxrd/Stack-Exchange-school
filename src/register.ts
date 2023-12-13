import "./config";
import { api } from "@hboictcloud/api";

function waitForElement(selector: string, callback: () => void): void {
    const observer: MutationObserver = new MutationObserver((mutationsList: MutationRecord[], observer: MutationObserver) => {
        const targetNode: Node | null = document.querySelector(selector);

        if (targetNode) {
            callback();
            observer.disconnect(); // Disconnect the observer once the element is found
        }
    });

    // Start observing the target node for configured mutations
    observer.observe(document.body, { childList: true, subtree: true });
}

// Example usage
waitForElement(".sidebar", () => {
    const Sidebar: HTMLElement | null = document.querySelector(".sidebar") as HTMLElement | null;
    if (Sidebar) {
        document.addEventListener("DOMContentLoaded", (e: Event)=>{
            console.log(e);
            const sidebar: HTMLElement | null = document.querySelector(".sidebar");

            console.log(sidebar);

            if (sidebar){
                sidebar.style.display = "none";
            }

            console.log("Your mom");
        } ) ;
    }
});

document.querySelector<HTMLButtonElement>(".register-btn")?.addEventListener("click", async (ev: MouseEvent) => {
    ev.preventDefault();

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
    const isUsernameTaken: boolean = await isUsernameAlreadyTaken(usernameInput.value);



    if (!usernameInput || !email || !password || !confirmPassword || !firstname || !lastname || !usernameError || !fieldsError || !emailError || !passwordError || !successMessage) {
        console.error("Error: Missing required elements");
        return;
    }
    
    // Check if all fields are filled
    if (!usernameInput.value || !email.value || !password.value || !confirmPassword.value || !firstname.value || !lastname.value) {
        fieldsError.style.display = "block";
        usernameError.style.display = "none";
        emailError.style.display = "none";
        successMessage.style.display = "none"; 
        passwordError.style.display = "none";
        return;
    }

    // Check if the username already exists
    else if (isUsernameTaken) {
        usernameError.style.display = "block";
        fieldsError.style.display = "none";
        emailError.style.display = "none";
        passwordError.style.display = "none";
        successMessage.style.display = "none";
        return;
    }

    // Check if the email has the correct format
    else if (!isValidEmail(email.value)) {
        emailError.style.display = "block";
        fieldsError.style.display = "none";
        usernameError.style.display = "none";
        passwordError.style.display = "none";
        successMessage.style.display = "none";
        return;
    }

    // Check if password and confirm password match
    else if (password.value !== confirmPassword.value) {
        passwordError.style.display = "block";
        fieldsError.style.display = "none";
        usernameError.style.display = "none";
        emailError.style.display = "none";
        successMessage.style.display = "none";
        return;
    }

    await api.queryDatabase("INSERT INTO user2 (username, password, email, firstname, lastname) VALUES (?)", [
        usernameInput.value,
        password.value,
        email.value,
        firstname.value,
        lastname.value,
    ]);

    // Show success message
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

// Check if username is in database
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

// Function to check if email is valid
function isValidEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
