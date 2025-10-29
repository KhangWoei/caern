const container: HTMLElement | null = document.getElementById("root");

if (container === null) {
    throw new Error("Root element not found.");
}

const welcome: HTMLElement = document.createElement("div");
welcome.textContent = "Caern.";
welcome.style.fontSize = "24px";

container.appendChild(welcome);
