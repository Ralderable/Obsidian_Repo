// Add the following code to import the necessary modules: 

const fs = require('fs');
const path = require('path');
const util = require('util');

// Create a function to recursively read the directory and build the file structure:

const readDirectory = async (dir) => {
    const readdir = util.promisify(fs.readdir); // Promisify the fs.readdir function
    const stat = util.promisify(fs.stat); // Promisify the fs.stat function

    let results = [];
    const list = await readdir(dir); // Read the directory
    for (const file of list) { // Iterate over the files in the directory
        const filePath = path.join(dir, file); // Get the full path of the file
        const fileStat = await stat(filePath); // Get the file stat
        if (fileStat.isDirectory()) { // If the file is a directory, recursively read it
            results.push({ // Add the directory to the results
                type: 'directory',
                name: file,
                path: filePath,
                children: await readDirectory(filePath) // Recursively read the directory
            });
        } else {
            results.push({ // Add the file to the results
                type: 'file',
                name: file,
                path: filePath
            });
        }
    }
    return results;
};

// Create a function to export the file structure to a JSON file:

const exportFileStructure = async (vaultPath, outputPath) => { // Define the exportFileStructure function
    try {
        const fileStructure = await readDirectory(vaultPath); // Read the directory and build the file structure
        fs.writeFileSync(outputPath, JSON.stringify(fileStructure, null, 2)); // Write the file structure to a JSON file
        console.log(`File structure has been exported to ${outputPath}`);
    } catch (error) {
        console.error('Error reading directory:', error);
    }
};

// Define the path to your Obsidian vault and the output path for the JSON file:

const vaultPath = '/path/to/your/obsidian/vault';
const outputPath = '/path/to/output/fileStructure.json';

exportFileStructure(vaultPath, outputPath); // Export the file structure to a JSON file
