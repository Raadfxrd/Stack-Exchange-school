import "./config";
import { session, api } from "@hboictcloud/api";

// Voer code uit wanneer de DOM geladen is
document.addEventListener("DOMContentLoaded", async () => {
    // Controleer of de gebruiker is ingelogd
    const loggedIn: number | null = session.get("user");

    // Als niet ingelogd dan verwijzen naar de inlogpagina
    if (!loggedIn) {
        window.location.href = "login.html";
        return;
    }

    // Maak een berichtcontainer om berichten aan gebruiker weer te geven
    const messageContainer: HTMLDivElement = document.createElement("div");
    messageContainer.id = "message-container";
    document.body.appendChild(messageContainer);

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

            if (userInfoElement) {
                // Toon gebruikersinformatie op de pagina
                userInfoElement.innerHTML = `
                    <p><strong>Naam:</strong> 
                        <span id="user-firstname">${user.firstname}</span> 
                        <span id="user-lastname">${user.lastname}</span>
                    </p>
                    <p>
                        <button id="edit-name-btn">Change Name</button>
                        <button id="delete-account-btn" style="background-color: red; color: white;">Delete Account</button>
                    </p>
                    <div id="edit-fields" style="display:none;">
                        <label for="new-firstname">New firstname: </label>
                        <input type="text" id="new-firstname">
                        <br>
                        <label for="new-lastname">New lastname: </label>
                        <input type="text" id="new-lastname">
                        <br>
                        <button id="save-changes">Save changes</button>
                        <button id="cancel-edit">Cancel changes</button>
                    </div>
                    <div id="deleteFail" style="display: none; color: red">
                    Failed to delete account. Please enter the correct confirmation text.
                    </div>
                    <div id="confirmation-modal" style="display:none;">
                        <p>Type <span style="color:red;"> CONFIRM DELETE </span> to confirm this process</p>
                        <p><strong>Note:</strong> Deleting your account will also remove all your messages and responses.</p>
                        <input type="text" id="confirmation-input">
                        <button id="confirm-delete" style="background-color:red; color: white;">Confirm Delete</button>
                        <button id="cancel-delete">Cancel</button>
                    </div>
                `;

                const editNameBtn: HTMLElement | null = document.getElementById("edit-name-btn");
                const deleteAccountBtn: HTMLElement | null = document.getElementById("delete-account-btn");
                const confirmationModal: HTMLElement | null = document.getElementById("confirmation-modal");
                const editFields: HTMLElement | null = document.getElementById("edit-fields");

                if (editNameBtn && deleteAccountBtn) {
                    // Voeg een eventlistener toe aan de editname knop
                    editNameBtn.addEventListener("click", () => {
                        // Toon bewerkingsvelden en verberg knoppen
                        if (editFields) {
                            editFields.style.display = "block";
                            editNameBtn.style.display = "none";
                            deleteAccountBtn.style.display = "none";
                        }
                    });

                    // Voeg een eventlistener toe aan de deleteaccount knop
                    deleteAccountBtn.addEventListener("click", () => {
                        // Toon het bevestigingsvenster en verberg knoppen
                        if (confirmationModal) {
                            confirmationModal.style.display = "block";
                            editNameBtn.style.display = "none";
                            deleteAccountBtn.style.display = "none";
                        }
                    });

                    // Haal de knoppen voor opslaan, bevestigen en annuleren op
                    const saveChangesBtn: HTMLElement | null = document.getElementById("save-changes");
                    const cancelEditBtn: HTMLElement | null = document.getElementById("cancel-edit");
                    const confirmDeleteBtn: HTMLElement | null = document.getElementById("confirm-delete");
                    const cancelDeleteBtn: HTMLElement | null = document.getElementById("cancel-delete");
                    const deleteFail: HTMLElement | null = document.getElementById("deleteFail");

                    if (saveChangesBtn && cancelEditBtn && confirmDeleteBtn && cancelDeleteBtn) {
                        // Voeg een eventlistener toe aan de savechanges knop
                        saveChangesBtn.addEventListener("click", async () => {
                            // Werk de gebruikersnaam bij en herlaad de pagina
                            await updateUserName(loggedIn);
                            window.location.reload();
                        });

                        // Voeg een eventlistener toe aan de annuleren-knop
                        cancelEditBtn.addEventListener("click", () => {
                            // Verberg bewerkingsvelden en toon knoppen
                            const editFields: HTMLElement | null = document.getElementById("edit-fields");
                            if (editFields) {
                                editFields.style.display = "none";
                                deleteAccountBtn.style.display = "block";
                                editNameBtn.style.display = "block";
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
                                await new Promise((resolve) => setTimeout(resolve, 3000));
                                deleteFail!.style.display = "none";
                            }
                            // Toon het bevestigingsvenster en verberg knoppen
                            confirmationModal!.style.display = "block";
                            editNameBtn.style.display = "none";
                            deleteAccountBtn.style.display = "none";
                        });

                        // Voeg een eventlistener toe aan de annuleren-knop voor verwijderen
                        cancelDeleteBtn.addEventListener("click", () => {
                            // Verberg het bevestigingsvenster en toon knoppen
                            confirmationModal!.style.display = "none";
                            editNameBtn.style.display = "block";
                            deleteAccountBtn.style.display = "block";
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
            const newFirstName: string = newFirstNameInput.value;
            const newLastName: string = newLastNameInput.value;

            const userFirstNameElement: HTMLElement | null = document.getElementById("user-firstname");
            const userLastNameElement: HTMLElement | null = document.getElementById("user-lastname");

            if (userFirstNameElement && userLastNameElement) {
                // Werk de naam op de pagina bij
                userFirstNameElement.textContent = newFirstName;
                userLastNameElement.textContent = newLastName;
            }

            // // Log de bijgewerkte gegevens
            // console.log("Gebruiker bijwerken met de volgende waarden:");
            // console.log(newFirstName);
            // console.log(newLastName);
            // console.log(userId);

            await api.queryDatabase(
                "UPDATE user2 SET firstname = ?, lastname = ? WHERE id = ?;",
                newFirstName,
                newLastName,
                userId
            );

            console.log("Name succesfully changed.");

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
        showMessage("Account succesfully deleted", "green");

        // Voer een databasequery uit om het account te verwijderen
        await api.queryDatabase("DELETE FROM user2 WHERE id = ?;", userId);

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
