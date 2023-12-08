export async function fetchAndParseHtml(url: string, options?: RequestInit): Promise<string> {
    try {
        const response: Response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch HTML (${response.status} ${response.statusText})`);
        }

        const html: string = await response.text();
        return html;
    } catch (error) {
        console.error("Error fetching and parsing HTML:", error);
        throw error;
    }
}

export async function loadNavbar(): Promise<void> {
    try {
        console.log("Fetching navbar...");
        const html: string = await fetchAndParseHtml("./navbar.html");
        console.log("HTML content:", html);

        const container: HTMLElement | null = document.getElementById("navbar-container");
        console.log("Container:", container);

        if (container) {
            container.innerHTML = html;
            console.log("Navbar loaded successfully!");
        } else {
            console.error("Container element not found.");
        }
    } catch (error) {
        console.error("Error loading navbar:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadNavbar);
