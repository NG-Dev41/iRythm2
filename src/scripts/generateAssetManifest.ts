const fs = require('fs');
const path = require('path');

const assetsPath = path.join (__dirname, '..', 'assets')
const files: string[] = fs.readdirSync(assetsPath, 'utf8');

let filesObject = {};


/**
 * Recursively gets all file names in a directory and adds them to the file object
 * @param filePath
 * @param file
 */
function loopOverFiles(filePath: string, file: string): void {
    // Create the full path to a file.
    // i.e. filePath is /assets/icon
    // file is icon-square-red.svg
    // fullFile is /assets/icon/icon-square-red.svg
    const fullFile = path.join(filePath, file);

    // Detect if the file is a directory/folder or not
    // If it is, then go through that directory
    // If not, then add file to the fileObject
    if(fs.statSync(fullFile, 'utf8').isDirectory()) {
        for(let dir of fs.readdirSync(fullFile, 'utf8')) {
            loopOverFiles(fullFile, dir);
        }
    } else {
        // File object contains same structure as directory structure
        // so path /assets/img/icons/red-square.svg becomes
        // assets {
        //          img {
        //              icons {
        //                  files: [
        //                       {
        //                          fileName: red-square.svg,
        //                          filePath: /assets/img/icons/red-square.svg
        //                      }
        //                  }
        //              }
        //          }
        // }

        // Split the file path to become the object properties we navigate
        let filePathStructure = filePath.split('\\');

        // We ignore the path up to /assets, because that path is dependent on each system, and where it stores traceqa-web
        let assetsFound = false;

        // Moving window representing the current location the for loop is in the fileObject structure
        // i.e. It might be filesObject.img, and then the next part of the loop will be filesObject.img.icons
        //      for the file path assets/img/icons/red-square.svg
        let folderObjectView = filesObject

        for(let folder of filePathStructure) {
            // ignore up to assets
            if(folder === 'assets') {
                assetsFound = true;
            } else if(assetsFound) {
                // Once assets are found, start navigating through the files object
                // initializing the sub-objects if needed
                // i.e. if folderObject.img is undefined, then set folderObject.img = {}
                //      If it already exists, then just navigate to it
                if(folderObjectView[folder]) {
                    folderObjectView = folderObjectView[folder]
                } else {
                    folderObjectView[folder] = {}
                    folderObjectView = folderObjectView[folder]
                }
            }
        }

        // Once file is navigated all the way through, add the file path and name to the files array in the folder
        // I.e. assets.img.icons.files.push( { fileName: red-square.svg, filePath: assets/img/icons/red-square.svg } )
        if(folderObjectView["files"]) {
            folderObjectView["files"].push({
                filePath: `assets/${fullFile.split('assets\\')[1].replace(/\\/g, "/")}`,
                fileName: file
            })
        } else {
            folderObjectView["files"] = [
                {
                    filePath: `assets/${fullFile.split('assets\\')[1].replace(/\\/g, "/")}`,
                    fileName: file
                }
            ]
        }
    }
}

// Loop over files in assets folder
for(let file of files) {
    loopOverFiles(assetsPath, file);
}

// Finally, save the assets manifest file
fs.writeFileSync(path.join(assetsPath, 'assets-manifest.json'), JSON.stringify(filesObject), 'utf8');
