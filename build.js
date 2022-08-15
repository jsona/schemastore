const fs = require("fs");
const path = require("path");
const store = require("./index.json");
const pkg = require("./package.json");
const URL_PATTERN = process.env.URL_PATTERN || "https://cdn.jsdelivr.net/npm/{{pkgName}}@{{pkgVersion}}/{{name}}";
const getUrl = name => {
  return URL_PATTERN
    .replace(/{{pkgName}}/g, pkg.name)
    .replace(/{{pkgVersion}}/g, pkg.version)
    .replace(/{{name}}/g, name)
}
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