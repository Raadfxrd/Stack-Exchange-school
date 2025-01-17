import "./config";
import { session, api } from "@hboictcloud/api";

const loggedIn: number | null = session.get("user");

// Voer code uit wanneer de DOM geladen is
document.addEventListener("DOMContentLoaded", async () => {
    // Controleer of de gebruiker is ingelogd
    // Als niet ingelogd dan verwijzen naar de inlogpagina
    if (!loggedIn) {
        window.location.href = "login.html";
        return;
    }

    // Maak een berichtcontainer om berichten aan gebruiker weer te geven
    const messageContainer: HTMLDivElement = document.createElement("div");
    messageContainer.id = "message-container";

    try {
        // Haal gebruikersgegevens uit de database
        const data: any = await api.queryDatabase(
            "SELECT firstname, lastname FROM user2 WHERE id = ?",
            loggedIn
        );

        if (data.length > 0) {
            // Haal gebruikersinformatie op
            const user: { firstname: string; lastname: string } = data[0];
            const userInfoElement: HTMLElement | null = document.getElementById("user-info");
            const firstNameDisplay: HTMLElement | null = document.getElementById("user-firstname");
            const lastNameDisplay: HTMLElement | null = document.getElementById("user-lastname");
            const deleteProfilePic: HTMLElement | null = document.getElementById("deleteProfilePicButton");

            firstNameDisplay!.innerText = user.firstname;
            lastNameDisplay!.innerText = user.lastname;

            if (userInfoElement) {
                const nameError: HTMLElement = document.getElementById("nameError") as HTMLElement;
                const editNameBtn: HTMLElement | null = document.getElementById("edit-name-btn");
                const deleteAccountBtn: HTMLElement | null = document.getElementById("delete-account-btn");
                const confirmationModal: HTMLElement | null = document.getElementById("confirmation-modal");
                const editFields: HTMLElement | null = document.getElementById("edit-fields");
                const editPasswordBtn: HTMLElement = document.getElementById(
                    "edit-password-btn"
                ) as HTMLElement;
                const passwordFields: HTMLElement | null = document.getElementById("password-fields");

                userInfoElement!.appendChild(messageContainer);

                if (editNameBtn && deleteAccountBtn) {
                    // Voeg een eventlistener toe aan de editname knop
                    editNameBtn.addEventListener("click", () => {
                        // Toon bewerkingsvelden en verberg knoppen
                        if (editFields) {
                            editFields.style.display = "block";
                            editNameBtn.style.display = "none";
                            deleteAccountBtn.style.display = "none";
                            editPasswordBtn.style.display = "none";
                            deleteProfilePic!.style.display = "none";
                        }
                    });

                    // Voeg een eventlistener toe aan de deleteaccount knop
                    deleteAccountBtn.addEventListener("click", () => {
                        // Toon het bevestigingsvenster en verberg knoppen
                        if (confirmationModal) {
                            confirmationModal.style.display = "block";
                            editNameBtn.style.display = "none";
                            deleteAccountBtn.style.display = "none";
                            editPasswordBtn.style.display = "none";
                            deleteProfilePic!.style.display = "none";
                        }
                    });

                    if (editPasswordBtn && passwordFields) {
                        editPasswordBtn.addEventListener("click", () => {
                            passwordFields.style.display = "flex";
                            editNameBtn.style.display = "none";
                            editPasswordBtn.style.display = "none";
                            deleteAccountBtn.style.display = "none";
                            deleteProfilePic!.style.display = "none";
                        });

                        const savePasswordBtn: HTMLElement | null = document.getElementById("save-password");
                        const cancelPasswordBtn: HTMLElement | null =
                            document.getElementById("cancel-password");

                        if (savePasswordBtn && cancelPasswordBtn) {
                            savePasswordBtn.addEventListener("click", async () => {
                                // Validate and update the password
                                await updatePassword(loggedIn);
                                await new Promise((resolve) => setTimeout(resolve, 500));
                            });

                            cancelPasswordBtn.addEventListener("click", () => {
                                passwordFields.style.display = "none";
                                deleteAccountBtn.style.display = "block";
                                editNameBtn.style.display = "block";
                                editPasswordBtn.style.display = "block";
                                deleteProfilePic!.style.display = "block";
                            });
                        }
                    }
                    // Haal de knoppen voor opslaan, bevestigen en annuleren op
                    const saveChangesBtn: HTMLElement | null = document.getElementById("save-changes");
                    const cancelEditBtn: HTMLElement | null = document.getElementById("cancel-edit");
                    const confirmDeleteBtn: HTMLElement | null = document.getElementById("confirm-delete");
                    const cancelDeleteBtn: HTMLElement | null = document.getElementById("cancel-delete");
                    const deleteFail: HTMLElement | null = document.getElementById(
                        "deleteFail"
                    ) as HTMLElement;

                    if (saveChangesBtn && cancelEditBtn && confirmDeleteBtn && cancelDeleteBtn) {
                        // Voeg een eventlistener toe aan de savechanges knop
                        saveChangesBtn.addEventListener("click", async () => {
                            // Werk de gebruikersnaam bij en herlaad de pagina
                            await updateUserName(loggedIn);
                        });

                        // Voeg een eventlistener toe aan de annuleren-knop
                        cancelEditBtn.addEventListener("click", () => {
                            // Verberg bewerkingsvelden en toon knoppen
                            const editFields: HTMLElement | null = document.getElementById("edit-fields");
                            if (editFields) {
                                editFields.style.display = "none";
                                deleteAccountBtn.style.display = "block";
                                editNameBtn.style.display = "block";
                                editPasswordBtn.style.display = "block";
                                nameError.style.display = "none";
                                deleteProfilePic!.style.display = "block";
                            }
                        });
                        const confirmationInput: HTMLInputElement | null = document.getElementById(
                            "confirmation-input"
                        ) as HTMLInputElement;

                        // Voeg een eventlistener toe aan de confirmdelete button
                        confirmDeleteBtn.addEventListener("click", async () => {
                            // Haal de bevestigingstekst op
                            const confirmationText: string = confirmationInput.value.trim();

                            // Als de bevestigingstekst correct is
                            if (confirmationText === "CONFIRM DELETE") {
                                await deleteAccount(loggedIn);
                            } else {
                                // Toon een foutmelding, wacht even en verberg dan de foutmelding
                                deleteFail!.style.display = "block";
                                setTimeout(() => {
                                    deleteFail!.style.display = "none";
                                }, 3000);
                            }
                            // Toon het bevestigingsvenster en verberg knoppen
                            confirmationModal!.style.display = "block";
                            editNameBtn.style.display = "none";
                            deleteAccountBtn.style.display = "none";
                            editPasswordBtn.style.display = "none";
                        });

                        // Voeg een eventlistener toe aan de annuleren-knop voor verwijderen
                        cancelDeleteBtn.addEventListener("click", () => {
                            // Verberg het bevestigingsvenster en toon knoppen
                            confirmationModal!.style.display = "none";
                            editNameBtn.style.display = "block";
                            deleteAccountBtn.style.display = "block";
                            editPasswordBtn.style.display = "block";
                            deleteFail.style.display = "none";
                            deleteProfilePic!.style.display = "block";
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
});

// Functie om de Naam bij te werken
async function updateUserName(userId: number): Promise<void> {
    const nameError: HTMLElement = document.getElementById("nameError") as HTMLElement;
    try {
        // Haal de nieuwe voornaam- en achternaamvelden op
        const newFirstNameInput: HTMLInputElement | null = document.getElementById(
            "new-firstname"
        ) as HTMLInputElement;
        const newLastNameInput: HTMLInputElement | null = document.getElementById(
            "new-lastname"
        ) as HTMLInputElement;

        if (newFirstNameInput && newLastNameInput) {
            // Haal de nieuwe voornaam- en achternaamwaarden op
            const newFirstName: string = newFirstNameInput.value.trim();
            const newLastName: string = newLastNameInput.value.trim();

            // Voer een check uit voor lege voornaam en achternaam
            if (newFirstName === "" || newLastName === "") {
                nameError.style.display = "block";
                setTimeout(() => {
                    nameError.style.display = "none";
                }, 2000);
                return;
            }

            const userFirstNameElement: HTMLElement | null = document.getElementById("user-firstname");
            const userLastNameElement: HTMLElement | null = document.getElementById("user-lastname");

            if (userFirstNameElement && userLastNameElement) {
                // Werk de naam op de pagina bij
                userFirstNameElement.textContent = newFirstName;
                userLastNameElement.textContent = newLastName;
            }

            await api.queryDatabase(
                "UPDATE user2 SET firstname = ?, lastname = ? WHERE id = ?;",
                newFirstName,
                newLastName,
                userId
            );
            window.location.reload();

            console.log("Name successfully changed.");

            // Verberg bewerkingsvelden
            const editFields: HTMLElement | null = document.getElementById("edit-fields");
            if (editFields) {
                editFields.style.display = "none";
            }
        }
    } catch (error) {
        console.error("Could not change name:", error);
    }
}

// Functie om een account te verwijderen
async function deleteAccount(userId: number): Promise<void> {
    try {
        // Toon een bericht dat het account succesvol is verwijderd
        showMessage("Account successfully deleted", "green");

        // Voer een databasequery uit om het account te verwijderen
        await api.queryDatabase("DELETE FROM user2 WHERE id = ?;", userId);
        // api.queryDatabase("DELETE FROM comments WHERE id = ?;", userId);

        // Wis de lokale opslag
        localStorage.clear();

        // Wacht even en herlaad dan de pagina
        await new Promise((resolve) => setTimeout(resolve, 500));
        window.location.href = "index.html";
    } catch (error) {
        // Log dat het verwijderen van het account is mislukt
        console.error("Could not delete account:", error);
    }
}

async function updatePassword(userId: number): Promise<void> {
    try {
        const currentPasswordInput: HTMLInputElement | null = document.getElementById(
            "current-password"
        ) as HTMLInputElement;
        const newPasswordInput: HTMLInputElement | null = document.getElementById(
            "new-password"
        ) as HTMLInputElement;
        const confirmNewPasswordInput: HTMLInputElement | null = document.getElementById(
            "confirm-new-password"
        ) as HTMLInputElement;
        const confirmError: HTMLInputElement | null = document.getElementById(
            "passwordMatch-error"
        ) as HTMLInputElement;
        const passwordError: HTMLInputElement | null = document.getElementById(
            "password-fail"
        ) as HTMLInputElement;
        const passwordSucces: HTMLInputElement | null = document.getElementById(
            "passwordSucces"
        ) as HTMLInputElement;

        if (currentPasswordInput && newPasswordInput && confirmNewPasswordInput) {
            const currentPassword: string = currentPasswordInput.value.trim();
            const newPassword: string = newPasswordInput.value.trim();
            const confirmNewPassword: string = confirmNewPasswordInput.value.trim();

            let b1: boolean = true;

            if (newPassword !== confirmNewPassword) {
                confirmError.style.display = "block";
                passwordError.style.display = "none";
                b1 = false;
                setTimeout(() => {
                    confirmError.style.display = "none";
                    return;
                }, 4000);
            } else {
                const result: string[] | any = await api.queryDatabase(
                    "SELECT password FROM user2 WHERE id=? AND password = ?;",
                    loggedIn,
                    currentPassword
                );
                if (!result[0]) {
                    passwordError.style.display = "block";
                    confirmError.style.display = "none";
                    b1 = false;

                    setTimeout(() => {
                        passwordError.style.display = "none";
                        return;
                    }, 4000);
                }
            }

            if (b1) passwordSucces.style.display = "block";
            setTimeout(() => {
                if (b1) passwordSucces.style.display = "none";
            }, 650);
            if (b1) {
                await api.queryDatabase(
                    "UPDATE user2 SET password = ? WHERE id = ? AND password = ?;",
                    newPassword,
                    userId,
                    currentPassword
                );
                // setTimeout(() => {}, 800);
            }
        }
    } catch (error) {
        console.error("Could not change password:", error);
    }
}

// Functie om een bericht weer te geven in een berichtcontainer
function showMessage(message: string, color: string): void {
    const messageContainer: HTMLElement | null = document.getElementById("message-container");
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.style.color = color;
        messageContainer.style.fontWeight = "bold";
        messageContainer.style.fontSize = "16px";
        messageContainer.style.marginTop = "10px";
    }
}
