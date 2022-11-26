import {listFiles, read, reCreateFolders, titlify, getDirectories, consolidateAssets, appendJSON, makeReviewPage, test} from "./build-directives/functions.mjs";

import variables from "./build-directives/variables.mjs";
import buildVariables from "./build-directives/build-variables.mjs";

let start = Date.now()
let compilation_date = start.toString() 



//PERFORMING BUILD


for (const folder of buildVariables.mainFolders) { reCreateFolders(folder) }
consolidateAssets()

for (const category of buildVariables.categories) { appendJSON(category) }
makeReviewPage()

// for (const directory of getDirectories('./pages')) {
//   makePage(directory)
// }

// makeSiteMapsEtc()


let end = Date.now()
console.log(`Completed in ${end-start}ms`)
// test()

