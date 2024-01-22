import hljs from "highlight.js";
import { MarkedOptions, Renderer, marked } from "marked";

document.addEventListener("DOMContentLoaded", async () => {
    const renderer: Renderer = new Renderer();
    let descriptionElement: HTMLElement | null = document.getElementById("question-description");
    let codeElement: HTMLElement | null = document.getElementById("question-code");

    if (descriptionElement) {
        let descriptionText: string = descriptionElement.textContent ?? "";
        descriptionElement.innerHTML = await marked(descriptionText, { renderer: renderer } as MarkedOptions);
    }

    if (codeElement) {
        let codeText: string = codeElement.textContent ?? "";
        codeElement.textContent = "";
        codeElement.appendChild(document.createTextNode(codeText));
        hljs.highlightBlock(codeElement);
    }
});
