
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function runCommand(command) {
    console.log(`\n\x1b[36mRunning: ${command}\x1b[0m`);
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`\x1b[31mCommand failed: ${command}\x1b[0m`);
        process.exit(1);
    }
}

function updateFile(filePath, updateFn) {
    const fullPath = path.resolve(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const newContent = updateFn(content);
    fs.writeFileSync(fullPath, newContent);
    return newContent;
}

// 1. Run Tests
console.log('\x1b[33mStep 1: Running Tests...\x1b[0m');
runCommand('npm test');

// 2. Determine new version
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = require(packageJsonPath);
const currentVersion = packageJson.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

console.log(`\x1b[33mStep 2: Bumping version from ${currentVersion} to ${newVersion}...\x1b[0m`);

// 3. Update files
// package.json
updateFile('package.json', (content) => content.replace(`"version": "${currentVersion}"`, `"version": "${newVersion}"`));

// package-lock.json using npm version would be cleaner but let's just do it manually if simple, or run npm version which creates a commit tag... 
// User asked for custom logic. Let's stick to manual file updates for control.
// Actually updating package-lock manually is risky. Let's ignore it for now or assume user runs npm install later. 
// Better: run `npm version` but without git tag/commit if we want to control steps?
// Let's use `npm version` as it handles package-lock.json too.
// Wait, I planned to do it manually. `npm version patch --no-git-tag-version` is safer.

runCommand(`npm version ${newVersion} --no-git-tag-version --allow-same-version`);

// version.ts
updateFile('version.ts', (content) => content.replace(`'${currentVersion}'`, `'${newVersion}'`));

// CHANGELOG.md
updateFile('CHANGELOG.md', (content) => {
    const today = new Date().toISOString().split('T')[0];
    const header = `## [${newVersion}] - ${today}\n\n### Changed\n- Automated release.\n\n`;
    // Insert after the first ## [Version] line or after header
    // The file has ## [1.1.1] ...
    // Regex replace to insert before the first version header
    const firstVersionRegex = /## \[\d+\.\d+\.\d+\]/;
    // Or just find the position
    const match = content.match(firstVersionRegex);
    if (match) {
        return content.slice(0, match.index) + header + content.slice(match.index);
    }
    return content; // Fallback
});

console.log('\x1b[33mStep 3: Commiting and Pushing...\x1b[0m');

// 4. Git operations
runCommand('git add .');
runCommand(`git commit -m "chore(release): bump version to ${newVersion}"`);
runCommand('git push');

console.log(`\n\x1b[32mSuccess! Version ${newVersion} released and pushed.\x1b[0m`);
