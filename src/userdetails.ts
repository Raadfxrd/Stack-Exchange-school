import "./config";
import { session, api } from "@hboictcloud/api";

document.addEventListener("DOMContentLoaded", async () => {
    const loggedIn: number | null = session.get("user");

    if (!loggedIn) {
        window.location.href = "login.html";
        return;
    }

    const messageContainer: HTMLDivElement = document.createElement("div");
    messageContainer.id = "message-container";
    document.body.appendChild(messageContainer);

    try {
        const data: any = await api.queryDatabase(
            "SELECT firstname, lastname FROM user2 WHERE id = ?",
            loggedIn
        );

        if (data.length > 0) {
            const user: { firstname: string; lastname: string } = data[0];
            const userInfoElement: HTMLElement | null = document.getElementById("user-info");

            if (userInfoElement) {
                userInfoElement.innerHTML = `
                    <p><strong>Name:</strong> 
                        <span id="user-firstname">${user.firstname}</span> 
                        <span id="user-lastname">${user.lastname}</span>
                    </p>
                    <p>
                        <button id="edit-name-btn">Edit Name</button>
                        <button id="delete-account-btn" style="background-color: red; color: white;">Delete Account</button>
                    </p>
                    <div id="edit-fields" style="display:none;">
                        <label for="new-firstname">New First Name: </label>
                        <input type="text" id="new-firstname">
                        <br>
                        <label for="new-lastname">New Last Name: </label>
                        <input type="text" id="new-lastname">
                        <br>
                        <button id="save-changes">Save Changes</button>
                        <button id="cancel-edit">Cancel</button>
                    </div>
                    <div id="deleteFail" style="display: none; color: green">
                    Account deletion failed. Please enter the correct confirmation text.
                    </div>
                    <div id="confirmation-modal" style="display:none;">
                    <p>Type CONFIRM DELETE to confirm this process:</p>
                    <p><strong>Note:</strong> Deleting your account will also delete all of your posts and answers.</p>
                    <input type="text" id="confirmation-input">
                    <button id="confirm-delete">Confirm Delete</button>
                    <button id="cancel-delete">Cancel</button>
                    </div>
                    `;

                const editNameBtn: HTMLElement | null = document.getElementById("edit-name-btn");
                const deleteAccountBtn: HTMLElement | null = document.getElementById("delete-account-btn");
                const confirmationModal: HTMLElement | null = document.getElementById("confirmation-modal");
                const editFields: HTMLElement | null= document.getElementById("edit-fields");

                if (editNameBtn && deleteAccountBtn) {
                    editNameBtn.addEventListener("click", ()=> {
                        if (editFields) {
                            editFields.style.display = "block";
                            editNameBtn.style.display = "none";
                            deleteAccountBtn.style.display = "none";

                        }
                    });

                    deleteAccountBtn.addEventListener("click", () => {
                        if (confirmationModal) {
                            confirmationModal.style.display = "block";
                            editNameBtn.style.display = "none";
                            deleteAccountBtn.style.display = "none";
                        }
                    });

                    const saveChangesBtn: HTMLElement | null = document.getElementById("save-changes");
                    const cancelEditBtn: HTMLElement | null = document.getElementById("cancel-edit");

                    if (saveChangesBtn && cancelEditBtn) {
                        saveChangesBtn.addEventListener("click", async ()=> {
                            await updateUserName(loggedIn);
                            window.location.reload();
                        });

                        cancelEditBtn.addEventListener("click", () => {
                            const editFields: HTMLElement | null = document.getElementById("edit-fields");
                            if (editFields) {
                                editFields.style.display = "none";
                                deleteAccountBtn.style.display = "block";
                                editNameBtn.style.display = "block";
                            }
                        });
                    }

                    const confirmationInput: HTMLInputElement | null = document.getElementById("confirmation-input") as HTMLInputElement;
                    const confirmDeleteBtn: HTMLElement | null = document.getElementById("confirm-delete");
                    const cancelDeleteBtn: HTMLElement | null = document.getElementById("cancel-delete");
                    const deleteFail: HTMLElement | null = document.getElementById("deleteFail");

                    if (confirmationInput && confirmDeleteBtn && cancelDeleteBtn) {
                        confirmDeleteBtn.addEventListener("click", async () => {
                            const confirmationText: string = confirmationInput.value.trim();
                            
                            if (confirmationText === "CONFIRM DELETE") {
                                await deleteAccount(loggedIn);
                            } else {
                                deleteFail.style.display = "block";
                                await new Promise(resolve => setTimeout(resolve, 3000));
                                deleteFail.style.display = "none";
                            }
                            confirmationModal.style.display = "block";
                            editNameBtn.style.display = "none";
                            deleteAccountBtn.style.display = "none";
                        });
                        
                        cancelDeleteBtn.addEventListener("click", () => {
                            confirmationModal.style.display = "none";
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

async function updateUserName(userId: number): Promise<void> {
    try {
        const newFirstNameInput: HTMLInputElement | null = document.getElementById(
            "new-firstname"
        ) as HTMLInputElement;
        const newLastNameInput: HTMLInputElement | null = document.getElementById(
            "new-lastname"
        ) as HTMLInputElement;

        if (newFirstNameInput && newLastNameInput) {
            const newFirstName: string = newFirstNameInput.value;
            const newLastName: string = newLastNameInput.value;

            const userFirstNameElement: HTMLElement | null = document.getElementById("user-firstname");
            const userLastNameElement: HTMLElement | null = document.getElementById("user-lastname");

            if (userFirstNameElement && userLastNameElement) {
                userFirstNameElement.textContent = newFirstName;
                userLastNameElement.textContent = newLastName;
            }

            console.log("Updating user with the following values:");
            console.log(newFirstName);
            console.log(newLastName);
            console.log(userId);

            await api.queryDatabase(
                "UPDATE user2 SET firstname = ?, lastname = ? WHERE id = ?;",
                newFirstName,
                newLastName,
                userId
            );

            console.log("User name updated successfully.");

            const editFields: HTMLElement | null = document.getElementById("edit-fields");
            if (editFields) {
                editFields.style.display = "none";
            }
        }
    } catch (error) {
        console.error("Failed to update user name:", error);
    }
}

async function deleteAccount(userId: number): Promise<void> {
    try {
        showMessage("Account successfully deleted.", "green");

        await api.queryDatabase("DELETE FROM user2 WHERE id = ?;", userId);
        localStorage.clear();
        await new Promise(resolve => setTimeout(resolve, 500));

        window.location.href = "index.html";
    } catch (error) {
        console.error("Failed to delete account:", error);
    }
}

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
