import "./config";
import { session, api } from "@hboictcloud/api";

document.addEventListener("DOMContentLoaded", async () => {
    const loggedIn: number | null = session.get("user");

    if (!loggedIn) {
        window.location.href = "login.html";
        return;
    }

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
                    <div id="confirmation-modal" style="display:none;">
                        <p>Type CONFIRM DELETE to confirm this process:</p>
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
                    editNameBtn.addEventListener("click", (event) => {
                        event.preventDefault();
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
                        saveChangesBtn.addEventListener("click", async () => {
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

                    if (confirmationInput && confirmDeleteBtn && cancelDeleteBtn) {
                        confirmDeleteBtn.addEventListener("click", async () => {
                            const confirmationText:any = confirmationInput.value.trim();
                            if (confirmationText === "CONFIRM DELETE") {
                                await deleteAccount(loggedIn);
                            } else {
                                confirmationText === "Confirmation failed. Account not deleted.";
                                confirmationModal.style.display = "none";
                                editNameBtn.style.display = "block";
                                deleteAccountBtn.style.display = "block";
                            }

                            // Close the confirmation modal
                            confirmationModal.style.display = "none";
                        });

                        cancelDeleteBtn.addEventListener("click", () => {
                            // Close the confirmation modal without deleting
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
        await api.queryDatabase("DELETE FROM user2 WHERE id = ?;", userId);
        localStorage.clear();
        window.location.href = "login.html";
    } catch (error) {
        console.error("Failed to delete account:", error);
    }
}
