import {listFiles, read, reCreateFolders, titlify, getDirectories, consolidateAssets, test} from "./build-directives/functions.mjs";

import variables from "./build-directives/variables.mjs";
import buildVariables from "./build-directives/build-variables.mjs";






//PERFORMING BUILD


// consolidateAssets()
for (const folder of buildVariables.mainFolders) { reCreateFolders(folder) }
consolidateAssets()



// for (const directory of getDirectories('./pages')) {
//   makePage(directory)
// }

// makeSiteMapsEtc()



test()

