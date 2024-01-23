// Importeer de benodigde bibliotheken
import hljs from "highlight.js";
import { marked, Renderer } from "marked";
import { MarkedOptions } from "marked";

// Haal de elementen op
const titleInput: HTMLInputElement = document.getElementById("title") as HTMLInputElement;
const descriptionInput: HTMLInputElement = document.getElementById("description") as HTMLInputElement;
const codeInput: HTMLInputElement = document.getElementById("code") as HTMLInputElement;

const titleOutput: HTMLElement = document.getElementById("title-output")!;
const descriptionOutput: HTMLElement = document.getElementById("description-output")!;
const codeOutput: HTMLElement = document.getElementById("code-output")!;
titleOutput.style.display = "none"; // Verberg de uitvoervakken initieel
descriptionOutput.style.display = "none";
codeOutput.style.display = "none";

// Maak een nieuwe instantie van de Renderer klasse
const renderer: Renderer = new Renderer();

// Voeg event listeners toe
titleInput.addEventListener("keyup", async function () {
    if (this.value.trim() !== "") {
        titleOutput.innerHTML = await marked(this.value, { renderer: renderer } as MarkedOptions);
        titleOutput.style.display = "block"; // Toon het uitvoervak
    } else {
        titleOutput.innerHTML = ""; // Maak de uitvoer leeg
        titleOutput.style.display = "none"; // Verberg het uitvoervak
    }
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});

descriptionInput.addEventListener("keyup", async function () {
    if (this.value.trim() !== "") {
        descriptionOutput.innerHTML = await marked(this.value, { renderer: renderer } as MarkedOptions);
        descriptionOutput.style.display = "block"; // Toon het uitvoervak
    } else {
        descriptionOutput.innerHTML = ""; // Maak de uitvoer leeg
        descriptionOutput.style.display = "none"; // Verberg het uitvoervak
    }
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});

codeInput.addEventListener("keyup", function () {
    if (this.value.trim() !== "") {
        const escapedHtml: string = escapeHtml(this.value);
        codeOutput.innerHTML = `<pre><code>${escapedHtml}</code></pre>`;
        const firstChild: HTMLElement | null = codeOutput.firstChild as HTMLElement;
        codeOutput.style.display = "block"; // Toon het uitvoervak
        if (firstChild instanceof HTMLElement) {
            hljs.highlightBlock(firstChild.firstChild as HTMLElement);
        }
    } else {
        codeOutput.innerHTML = ""; // Maak de uitvoer leeg
        codeOutput.style.display = "none"; // Verberg het uitvoervak
    }
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});

// Functie om HTML te ontsnappen
function escapeHtml(html: string): string {
    const text: Text = document.createTextNode(html);
    const div: HTMLDivElement = document.createElement("div");
    div.appendChild(text);
    return div.innerHTML;
}
