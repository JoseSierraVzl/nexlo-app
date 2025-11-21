const fs = require("fs");
const postcss = require("postcss");
const tailwind = require("@tailwindcss/postcss");

const inputFile = "./src/app/globals.css";
const outputFile = "./src/app/output.css";

fs.readFile(inputFile, "utf8", (err, css) => {
    if (err) throw err;

    postcss([
        tailwind({
            content: ["./src/**/*.{html,ts,tsx}"], // <-- Aquí indicamos qué archivos analizar
        }),
    ])
        .process(css, { from: inputFile, to: outputFile })
        .then(result => {
            fs.writeFileSync(outputFile, result.css);
            console.log("CSS procesado con éxito:", outputFile);
        })
        .catch(console.error);
});
