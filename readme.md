# Wallet Scrutiny Website

## About this project
### Unofficial preamble 
Wallet Scrutiny is a collection of reviews of crypto-currency wallets.

The reviews primarily test for matching outputs between the examinable codebase (like a public repository on github) and an installation of the app via its primary source (usually an app store on a mobile device)

Matching outputs, a.k.a. "reproducibility" is the best verdict a review can achieve. This verdict suggests that at the very least, the wallet providers are distributing the same version of the app to users that they are presenting for public examination. 

No other conclusions can be drawn from this verdict.
Poorer verdicts, such as "no-source" and "not reproducible", suggest that since a wallet provider is presenting a different version of an app for public examination than the version that will be installed on the user device, they may be dishonest in other practices too. 

Only poorer and poorer verdicts exist. No conclusions can usually be drawn.

### Data as a USP
The data accumulated by Wallet Scrutiny, and the verdicts is the main asset of the project.
 - The data must be beautifully presented on the website for user consumption
 - The data should be organised on git for perusal
 - The data should be easily formatted/able to be formatted into consumable objects. 

## Testing locally
### Basic requirements
- Python
- Latest stable Node.js

### To Run
- Clone repository
- Enter repository folder ```cd {{REPO FOLDER}}```
- Install dependencies ```npm install```
- Build dist ```node ./build.js```
- Start local web-server ```http-server ./dist -p 8080```
- The site is now available at http://127.0.0.1:8080