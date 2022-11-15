import fs from 'fs'
import fse from 'fs-extra'
import sass from 'node-sass'
import path from 'path'
import UglifyJS from "uglify-js"

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
  ;

  const directoriesInDIrectory = fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  return directoriesInDIrectory
}
function consolidateAssets() {
  


  const directories = ['./src/css/', './src/js/']
  for (const dir of directories) {
    let data = ''
    let cssMap = ''
    let assets = listFiles(dir)
    assets = assets.filter(asset => asset.indexOf(".")>=0)
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
          includePaths:[dir + '/components/', dir],
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
    fse.copySync(dir, destDir)
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
  console.log("test successful")
}

export {listFiles, read, reCreateFolders, titlify, getDirectories, consolidateAssets, test}