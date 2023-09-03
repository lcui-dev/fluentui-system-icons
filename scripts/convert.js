import fs from "fs";
import path from "path";

const fonts = [
  {
    className: "fui-icon-filled",
    name: "FluentSystemIcons-Filled",
  },
  {
    className: "fui-icon-regular",
    name: "FluentSystemIcons-Regular",
  },
];

const iconFileMain = `
type IconName = keyof typeof iconMap;

interface IconProps {
  className?: string;
  size?: number;
}

interface IconExProps {
  className?: string;
  name: IconName;
  filled?: boolean;
  size?: number;
}

function clsx(...args) {
  return args.filter(Boolean).join(' ');
}

export function Icon({ className, name, filled, size }: IconExProps) {
  const iconData = iconMap[name];
  const error = <text>unknown icon: {name}</text>;

  if (!iconData) {
    return error;
  }

  const style = filled ? 'filled' : 'regular';
  const codeMap = iconData[style];

  if (!codeMap) {
    return error;
  }

  const sizeList = Object.keys(codeMap).map(Number).sort();
  const targetSize = (size && sizeList.filter((s) => s >= size)[0]) || sizeList[0];
  const code = codeMap[targetSize];
  return (
    <text
      className={clsx(\`fui-icon-\${style}\`, className)}
      fontSize={size}
    >
      \\u{code.toString(16)}
    </text>
  );
}

Icon.shouldPreRender = true;`;

function generateIconCode(ident, name, filled = false) {
  return `
export const ${ident} = (props: IconProps) => <Icon name="${name}" ${
    filled ? "filled " : ""
  }{...props} />;
${ident}.shouldPreRender = true;`;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function ouputFile(filePath, content) {
  console.log(`output ${filePath}`);
  fs.writeFileSync(filePath, content, {
    encoding: "utf-8",
  });
}

function convert(fontsDirPath) {
  const iconMap = {};
  const iconCssOutput = [];
  const iconTsxOutput = ['import React from "react";'];
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
  }
  fonts.forEach((font) => {
    const jsonFile = path.join(fontsDirPath, `${font.name}.json`);
    const jsonData = JSON.parse(
      fs.readFileSync(jsonFile, { encoding: "utf-8" })
    );
    const iconList = Object.keys(jsonData).map((key) => ({
      code: jsonData[key],
      name: key.replace("ic_fluent_", "").replace(/_/g, "-"),
    }));
    const mainCss = [
      "@font-face {",
      `  font-family: "${font.name}";`,
      `  src: url("${font.name}.ttf");`,
      "}\n",
      `.${font.className} {`,
      `  font-family: "${font.name}";`,
      "  font-style: normal;",
      "}\n",
    ].join("\n");
    const fullCss = `${mainCss}\n${iconList
      .map(
        ({ code, name }) =>
          `.${name} {\n  content: "\\${code.toString(16)}";\n}`
      )
      .join("\n")}`;

    iconCssOutput.push(mainCss);

    iconList.forEach((icon) => {
      const list = icon.name.replace("-regular|-filled", "").split("-");
      const style = icon.name.includes("-filled") ? "filled" : "regular";
      const size = list[list.length - 2];
      const name = list.slice(0, list.length - 2).join("-");
      if (!iconMap[name]) {
        iconMap[name] = {
          regular: {},
          filled: {},
          hasFilledStyle: false,
          hasRegularStyle: false,
        };
      }
      iconMap[name][style][size] = icon.code;
      if (style === "regular") {
        iconMap[name].hasRegularStyle = true;
      } else {
        iconMap[name].hasFilledStyle = true;
      }
    });

    ouputFile(path.join("dist", `${font.name}.css`), `${fullCss}\n`);
    console.log(`output ${path.join("dist", `${font.name}.ttf`)}`);
    fs.copyFileSync(
      path.join(fontsDirPath, `${font.name}.ttf`),
      path.join("dist", `${font.name}.ttf`)
    );
  });
  iconTsxOutput.push(
    `\nconst iconMap = ${JSON.stringify(iconMap, null, 2)};`,
    iconFileMain
  );
  Object.keys(iconMap)
    .sort()
    .forEach((key) => {
      const ident = key.split("-").map(capitalizeFirstLetter).join("");
      if (iconMap[key].hasRegularStyle) {
        iconTsxOutput.push(generateIconCode(ident, key));
      }
      if (iconMap[key].hasFilledStyle) {
        iconTsxOutput.push(generateIconCode(`${ident}Filled`, key, true));
      }
    });
  ouputFile(path.join("dist", "style.css"), iconCssOutput.join("\n"));
  ouputFile(path.join("src", "index.tsx"), iconTsxOutput.join("\n"));
}

if (process.argv.length > 2) {
  convert(process.argv[2]);
}
