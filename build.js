const fs = require("fs");
const path = require("path");
const store = require("./index.json");
const pkg = require("./package.json");
const getUrl = name => `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/${name}`
const getPath = subpath => path.resolve(__dirname, subpath);

fs.rmSync(getPath("pkg"), { recursive: true, force: true });
fs.mkdirSync(getPath("pkg"));

let output = [];
for (const item of store) {
  let name = `${item.name}.jsona`;
  let source = getPath(`schemas/${name}`);
  try {
    fs.copyFileSync(source, getPath(`pkg/${name}`));
    output.push({ ...item, url: getUrl(name) })
  } catch {}
}

fs.writeFileSync(getPath(`pkg/index.json`), JSON.stringify(output, null, 2));

[
  "package.json",
  "README.md",
].map(name => {
  fs.copyFileSync(getPath(name), getPath(`pkg/${name}`));
})