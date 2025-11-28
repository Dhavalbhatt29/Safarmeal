import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname + __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAllFiles(dir, fileList = []) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function checkImports() {
  const projectDir = path.join(__dirname, "src");
  const allFiles = getAllFiles(projectDir);

  allFiles.forEach(file => {
    if (!file.endsWith(".js") && !file.endsWith(".jsx")) return;

    const content = fs.readFileSync(file, "utf8");

    const importLines = content.match(/import\s+.*?from\s+['"].+['"]/g);
    if (!importLines) return;

    importLines.forEach(line => {
      const match = line.match(/from ['"](.*)['"]/);
      if (!match) return;

      const importPath = match[1];

      if (!importPath.startsWith(".")) return;

      const fullPath = path.resolve(path.dirname(file), importPath);
      const folderFiles = fs.readdirSync(path.dirname(fullPath));

      const importedFile = path.basename(fullPath);
      const correctMatch = folderFiles.find(f => f === importedFile);

      if (!correctMatch) {
        console.log("\n❌ CASE MISMATCH FOUND");
        console.log("File:", file);
        console.log("Import:", line);
        console.log("Possible matches:", folderFiles);
        console.log("---------------------------------------");
      }
    });
  });

  console.log("\n✅ Import check completed.");
}

checkImports();
