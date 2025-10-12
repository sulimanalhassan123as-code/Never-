const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const downloadBtn = document.querySelector(".download-btn");

let history = [];

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    if (value === "C") {
      display.textContent = "";
    } else if (value === "=") {
      try {
        const result = eval(display.textContent);
        history.push(`${display.textContent} = ${result}`);
        display.textContent = result;
      } catch {
        display.textContent = "Error";
      }
    } else {
      display.textContent += value;
    }
  });
});

downloadBtn.addEventListener("click", () => {
  if (history.length === 0) {
    alert("No history to download yet!");
    return;
  }

  const blob = new Blob([history.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "calc_history.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
});
