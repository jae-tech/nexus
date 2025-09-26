// scripts/create-app.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectName = process.argv[2];
if (!projectName) {
  console.error("Usage: pnpm create-app <project-name>");
  process.exit(1);
}

const templatePath = path.join(__dirname, "../apps/react-boilerplate");
const newProjectPath = path.join(__dirname, "../apps", projectName);

try {
  // 템플릿 존재 확인
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template not found at ${templatePath}`);
    process.exit(1);
  }

  // 이미 존재하는 프로젝트명 확인
  if (fs.existsSync(newProjectPath)) {
    console.error(`❌ Project '${projectName}' already exists`);
    process.exit(1);
  }

  // 보일러플레이트 복사
  fs.cpSync(templatePath, newProjectPath, { recursive: true });
  console.log("✅ Project structure copied");

  // package.json 업데이트
  const packageJsonPath = path.join(newProjectPath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  packageJson.name = projectName;
  packageJson.description = `${projectName} - Built with Nexus Design System`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("✅ Package.json updated");

  // README 업데이트
  const readmePath = path.join(newProjectPath, "README.md");
  const readmeContent = `# ${projectName}

${projectName} - Built with Nexus Design System

## Development

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
\`\`\`

## Features

- React 19 + Vite + TypeScript
- TailwindCSS v4
- Nexus UI Components
- TanStack Router
- Theme System (Dark/Light)

Built with [Nexus Design System](../react-boilerplate)
`;

  fs.writeFileSync(readmePath, readmeContent);
  console.log("✅ README updated");

  console.log(`\n🎉 Project '${projectName}' created successfully!`);
  console.log(`📁 Location: apps/${projectName}`);
  console.log(`\n🚀 To get started:`);
  console.log(`   cd apps/${projectName}`);
  console.log(`   pnpm dev`);
  console.log(`\n   Or from root:`);
  console.log(`   pnpm --filter ${projectName} dev`);
} catch (error) {
  console.error("❌ Error creating project:", error.message);
  process.exit(1);
}
