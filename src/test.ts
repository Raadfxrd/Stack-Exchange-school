import { api, types, utils, session } from "@hboictcloud/api";
const loggedIn: number | null = session.get("user");
document.addEventListener("DOMContentLoaded", async () => {
    // Controleer of de gebruiker is ingelogd
    // Als niet ingelogd dan verwijzen naar de inlogpagina
    if (!loggedIn) {
        window.location.href = "login.html";
        return;
    }
});


async function main(): Promise<void> {  
    //Get the input-element
    const fileUploadInput: HTMLInputElement = document.querySelector("#fileUpload")!;
    const profilePicExists: boolean = await api.fileExists(`user${loggedIn}/profile.jpg`) as boolean;

    if(profilePicExists){
        (document.querySelector("#imagePreview") as HTMLImageElement).src = `https://kaalaaqaapii58-pb2a2324.hbo-ict.cloud/uploads/user${loggedIn}/profile.jpg`;
    }

    fileUploadInput.addEventListener("change", async () => {
        console.log(" event fired" );
            
        //Generate a Data-URL
        const data: types.DataURL = (await utils.getDataUrl(fileUploadInput)) as types.DataURL;

        //Upload the data
        const result: string = await api.uploadFile(`user${loggedIn}/profile.jpg`, data.url, true);

        if (data.isImage) {
            (document.querySelector("#imagePreview") as HTMLImageElement).src = data.url;
        }
        location.reload();
        console.log(result);
    });
}

main();
