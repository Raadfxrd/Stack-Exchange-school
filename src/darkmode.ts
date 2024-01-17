document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle: any = document.getElementById("dark-mode-toggle");

    if (darkModeToggle) {
        darkModeToggle.addEventListener("change", () => {
            const isDarkMode: boolean = darkModeToggle.checked;
            document.body.classList.toggle("dark-mode", isDarkMode);
            localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
        });

        // Check local storage for user's preference and set the initial state
        const storedDarkMode: string | null = localStorage.getItem("darkMode");
        const isDarkMode: boolean = storedDarkMode ? JSON.parse(storedDarkMode) : false;

        darkModeToggle.checked = isDarkMode;
        document.body.classList.toggle("dark-mode", isDarkMode);
    } else {
        console.error("Dark mode toggle element not found.");
    }
});
