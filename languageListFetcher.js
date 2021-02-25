/*** Google API를 이용해서 language list를 가져온다 ****/

// file read & write 
const fs = require('fs')
// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2
// dotenv enables process.env
require('dotenv').config()

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS)

// Instantiates a client
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
})

async function listLanguages() {
    const [languages] = await translate.getLanguages();
    
    languages.forEach((language) =>
        console.log(language)
    );

    const data = JSON.stringify(languages)
    fs.writeFileSync('./data/language_code.json', data)

}

listLanguages();