const { execSync } = require('child_process');
const fs = require('fs');

// Key packages needed for the app to run
const packages = [
  'express@4.21.2',
  'tsx@4.20.3', 
  'vite@5.4.14',
  'typescript@5.6.3',
  'react@18.3.1',
  'react-dom@18.3.1'
];

console.log('Installing essential packages...');
for (const pkg of packages) {
  try {
    console.log(`Installing ${pkg}...`);
    execSync(`npx --yes --package=${pkg} --package=express@4.21.2 echo "Package ${pkg} ready"`, {stdio: 'inherit'});
  } catch (e) {
    console.log(`Failed to prepare ${pkg}`);
  }
}
