import fs from 'fs'
import fse from 'fs-extra'
import sass from 'node-sass'
import path from 'path'
import UglifyJS from "uglify-js"
import yaml from 'js-yaml'
import variables from "./variables.mjs";
import { defaultMaxListeners } from 'events'

function listFiles(parent) {

  let dir = parent ? parent : '/';
  return fs.readdirSync(dir)
}

function read(file) {

  return fs.readFileSync(file, 'utf8');
}

function reCreateFolders(folder) {

  folder = folder ? folder : '/dist'
  if (fs.existsSync(folder)) { fs.rmSync(folder, { recursive: true }) }
  fs.mkdirSync(folder)
}

function titlify(text) {
  text = text.replace(/_/g, ' ')
  text = text[0].toUpperCase() + text.substring(1, text.length)
  text = text === 'Homepage' ? '' : text + ' | '
  return text
}

function getDirectories(dir) {
  const directoriesInDIrectory = fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  return directoriesInDIrectory
}

function getFiles(dir) {
  const directoriesInDIrectory = fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);

  return directoriesInDIrectory
}

function appendJSON(category) {
  let workingJSON = JSON.parse(read('./tmp/wallets.json'))
  let files = getFiles(category)
  let categoryName = category.replace("./components/_", "")
  for (const file of files) {
    let parseData = read(category + '/' + file).split("---")[1]
    parseData = yaml.load(parseData);
    let key = file.substring(file.length - 3) === ".md" ? file.substring(0, file.length - 3) : file
    parseData.raw = String(category + '/' + file)
    parseData.category = categoryName
    workingJSON[key] = parseData
  }
  fs.writeFileSync('./tmp/wallets.json', JSON.stringify(workingJSON));
  fs.writeFileSync('./dist/src/json/wallets.json', JSON.stringify(workingJSON));
  reCreateFolders("./dist/" + categoryName)
}

function replaceVariablePlaceholders(component, placeholders = null, replacements = null) {
  let index = 0,
    placeholders_ = [],
    replacedComponent = component
  placeholders = !placeholders ? variables : placeholders
  replacements = !replacements ? [] : replacements
  if (replacements.length < 1) {
    for (const key of Object.keys(placeholders)) {
      placeholders_.push("$" + key)
      replacements.push(placeholders[key])
    }
  }
  let placeholders__ = placeholders_.length > 0 ? placeholders_ : placeholders
  for (const placeholder of placeholders__) {
    replacedComponent = replacedComponent.replace(/$/g, "####################################################" + replacements[index])
    console.log(replacedComponent)
    index++
  }
  // console.log(replacedComponent)
  return replacedComponent
}

function replaceFixedPlaceholders(component) {
  let index = 0,
    placeholders = [],
    replacements = []
  for (const [key, value] of Object.entries(variables)) {
    placeholders.push("$" + key)
    replacements.push(value)
  }
  for (const placeholder of placeholders) {
    const regex = new RegExp("\\" + placeholder, "g")
    component = component.replace(regex, replacements[index])
    index++
  }
  // console.log(replacedComponent)
  return component
}

function createReviewContents(html, json) {

}

function stringToHTMLPara(string) {
  // let html = "<p>"
  // html += string.replace(/\\n\\n/g, "</p><p>")
  // return html + "</p>"
  return string
}

function writeHumanReadableTime(html, current) {
  const currentTime = new Date().getTime() / 1000
  const timestamp = new Date(current.updated).getTime() / 1000
  const date = new Date(current.date).toLocaleDateString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const elapsedDays = Math.floor((currentTime - timestamp) / 60 / 60 / 24)
  let readableString = ""
  const options = {
    year: elapsedDays / 365,
    month: elapsedDays / 30,
    week: elapsedDays / 7,
    day: elapsedDays
  }
  for (const key in options) {
    let result = Math.floor(options[key])
    readableString = result > 0 ? `${result} ${key}${result > 1 ? "s" : ""} ago` : "today"
  }
  html = html.replace(/\$elapsed_updated/g, readableString)
  html = html.replace(/\$format_date/g, date)
  return html
}

function writeSectionVerdict(html, current) {
  let sectionVerdict = String(read("./components/sections/section-verdict.ejs"))
  let verdictData = yaml.load(read("./components/_data/verdicts/" + current.verdict + ".yml"))
  for (const [key, value] of Object.entries(verdictData)) {
    const regex = new RegExp("\\$v." + key, "g");
    sectionVerdict = sectionVerdict.replace(regex, value)
  }
  return html.replace("$section-verdict", sectionVerdict)
}

function makeReviewPage() {
  const wallets = JSON.parse(read('./tmp/wallets.json'))
  const components = ["footer", "doc_head", "menu", "article"]
  let bodyTemplate = String(read("./components/sections/body-wrapper.ejs"))
  //PLACE TEMPLATE COMPONENTS (I.E. MENU, FOOTER, ETC.) INTO BODY WRAPPER TEMPLATE
  for (const component of components) {
    let componentTemplate = replaceFixedPlaceholders(read("./components/sections/" + component + ".ejs"))
    const regex = new RegExp("\\$" + component);
    bodyTemplate = bodyTemplate.replace(regex, componentTemplate)
  }
  //LOOP OVER KEYED OBJECTS IN WALLETS JSON
  for (const appId_key of Object.keys(wallets)) {
    let current = wallets[appId_key]
    //LOOP OVER EACH OBJECT IN WALLET OBJECT
    //AND REPLACE WITH BROAD KEY ITEMS
    for (const [key, value] of Object.entries(current)) {
      const regex = new RegExp("\\$" + key, "g");
      bodyTemplate = bodyTemplate.replace(regex, value)
    }
    //ORGANISE FUNCTIONS BY PERTINENT SECTION
    bodyTemplate = writeHumanReadableTime(bodyTemplate, current)
    bodyTemplate = writeSectionVerdict(bodyTemplate, current)
    reCreateFolders("./dist/" + current.category + '/' + appId_key)
    fs.writeFileSync('./dist/' + current.category + '/' + appId_key + '/index.html', bodyTemplate);
  }
}

function consolidateAssets() {
  const directories = ['./src/css/', './src/js/']
  for (const dir of directories) {
    let data = ''
    let cssMap = ''
    let assets = listFiles(dir)
    assets = assets.filter(asset => asset.indexOf(".") >= 0)
    let directory = '.' + dir.replace('./src/', '').replace(/\//g, '')
    let newFile = dir.replace("./", "./dist/") + "file" + directory
    for (const asset of assets) {
      let assetData = read(dir + asset)
      let ext = path.parse(asset).ext
      if (ext === ".map") {
        cssMap += assetData;
      }
      if (ext === ".css") {
        data += assetData + " "
      }
      if (ext === ".js") {
        data += UglifyJS.minify(assetData).code + " "
      }
      if (ext === '.scss') {
        var result = sass.renderSync({
          file: dir + asset,
          includePaths: [dir + '/components/', dir],
          data: assetData,
          outputStyle: 'compressed',
          outFile: dir + '/file.css',
          sourceMap: true,
        });
        data += result.css
        cssMap += result?.map
      }
    }
    fs.writeFileSync(newFile, data);
    fs.writeFileSync("./dist/src/css/file.css.map", cssMap);
  }

  const assetFolders = ['./src/img/', './src/fonts/']
  for (const dir of assetFolders) {
    let destDir = dir.replace('./src/', './dist/src/')
    fse.copy(dir, destDir)
  }

  let primaryFolders = ["./tmp"]
  for (const folder of primaryFolders) {
    reCreateFolders(folder)
  }

  fs.writeFileSync('./tmp/wallets.json', '{}');
  if (!fs.existsSync('./dist/src/json')) {
    reCreateFolders('./dist/src/json')
  }
}

// let siteMap = '<urlset></urlset>'
// function appendSiteXML(dir) {
//   let date = new Date()
//   let loc = `<url>
//   <loc>${variables.site + dir}</loc>
//   <lastmod>${date}</lastmod>
//   <changefreq>monthly</changefreq>
//   <priority>1</priority>
// </url>
// </urlset>`;
//   siteMap = siteMap.replace("</urlset>", loc)
// }

// function makeSiteMapsEtc() {
//   
//   fs.writeFileSync('./dist/site.xml', siteMap);
//   fs.writeFileSync('./dist/sitemap.xml', siteMap);
//   fs.writeFileSync('./dist/robots.txt', `
// User-agent: *
// Disallow: /src/

// User-agent: Googlebot
// Allow: /src/

// Sitemap: https://flat18.co.uk/sitemap.xml
// `);
// }

function test() {
  console.log("test print successful")
}

export { listFiles, read, reCreateFolders, titlify, getDirectories, consolidateAssets, appendJSON, makeReviewPage, test }