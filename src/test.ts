import { api, types, utils, session } from "@hboictcloud/api";

const loggedIn: number | null = session.get("user");

document.addEventListener("DOMContentLoaded", async () => {
    // Controleer of de gebruiker is ingelogd
    // Als niet ingelogd dan verwijzen naar de inlogpagina
    if (!loggedIn) {
        window.location.href = "login.html";
        return;
    }

    await main();
});

async function main(): Promise<void> {
    const fileUploadInput: HTMLInputElement = document.querySelector("#fileUpload")!;
    const profilePicExists: boolean = (await api.fileExists(`user${loggedIn}/profile.jpg`)) as boolean;
    let selectedFile: types.DataURL | null = null;

    if (profilePicExists) {
        (
            document.querySelector("#imagePreview") as HTMLImageElement
        ).src = `https://kaalaaqaapii58-pb2a2324.hbo-ict.cloud/uploads/user${loggedIn}/profile.jpg`;
    }

    fileUploadInput.addEventListener("change", async () => {
        console.log(" event fired");

        selectedFile = (await utils.getDataUrl(fileUploadInput)) as types.DataURL;

        const imageUploadButtons: HTMLElement | null = document.getElementById("imageUploadButtons");
        if (selectedFile) {
            imageUploadButtons!.style.display = "flex";
            if (selectedFile.isImage) {
                (document.querySelector("#imagePreview") as HTMLImageElement).src = selectedFile.url;
            }
        } else {
            imageUploadButtons!.style.display = "none";
        }
    });

    document.querySelector("#saveButton")?.addEventListener("click", async () => {
        if (selectedFile) {
            const result: string = await api.uploadFile(
                `user${loggedIn}/profile.jpg`,
                selectedFile.url,
                true
            );

            location.reload();
            console.log(result);
        }
    });

    document.querySelector("#deleteProfilePicButton")?.addEventListener("click", async () => {
        await api.deleteFile(`user${loggedIn}/profile.jpg`);

        (document.querySelector("#imagePreview") as HTMLImageElement).src = "./assets/images/image.jpg";

        selectedFile = null;

        fileUploadInput.value = "";
        location.reload();
    });

    document.querySelector("#cancelButton")?.addEventListener("click", () => {
        if (profilePicExists) {
            (
                document.querySelector("#imagePreview") as HTMLImageElement
            ).src = `https://kaalaaqaapii58-pb2a2324.hbo-ict.cloud/uploads/user${loggedIn}/profile.jpg`;
        }

        selectedFile = null;

        fileUploadInput.value = "";

        const imageUploadButtons: HTMLElement | null = document.getElementById("imageUploadButtons");
        imageUploadButtons!.style.display = "none";
    });
}
