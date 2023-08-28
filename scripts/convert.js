const fs = require("fs");
const path = require("path");

function convert(fontsDirPath) {
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
  }
  fs.readdirSync(fontsDirPath).forEach((name) => {
    const filePath = path.join(fontsDirPath, name);
    if (!name.endsWith(".json")) {
      return;
    }
    const family = path.parse(name).name;
    const data = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
    const header = [
      "@font-face {",
      `  font-family: "${family}";`,
      `  src: url("${family}.ttf");`,
      "}",
      ".icon {",
      `  font-family: "${family}";`,
      "  font-style: normal;",
      "}",
    ].join("\n");
    const result = Object.keys(data)
      .map((key) => {
        const content = `\\${data[key].toString(16)}`;
        const className = key
          .replace("ic_fluent_", "icon-")
          .replace(/_regular$/, "")
          .replace(/_/g, "-");
        return `.${className} {\n  content: "${content}";\n}`;
      })
      .join("\n");
    console.log(`output ${path.join("dist", `${family}.css`)}`);
    fs.writeFileSync(
      path.join("dist", `${family}.css`),
      `${header}\n${result}\n`,
      { encoding: "utf-8" }
    );
    console.log(`output ${path.join("dist", `${family}.ttf`)}`);
    fs.copyFileSync(
      path.join(fontsDirPath, `${family}.ttf`),
      path.join("dist", `${family}.ttf`)
    );
  });
}

if (process.argv.length > 2) {
  convert(process.argv[2]);
}
