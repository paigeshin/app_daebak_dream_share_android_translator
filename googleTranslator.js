//실제로 번역한다. 

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

const translateText = async (text, targetLanguage) => {
    try {
        let [translation] = await translate.translate(text, targetLanguage)
        return translation
    } catch (error) {
        console.log(`Error at translateText --> ${error}`)
        return 0
    }
}

// for(let i = 0; i < 100; i++) {
//     translateText('안녕하세요', 'en')
//     .then(translation => {
//         console.log(translation)
//     })
//     .catch(error => {
//         console.log(error)
//     })
// }



/*
    Pseudo Code
    
    1. language code를 읽어와서 array로 만든다.
    2. 번역할 영어 파일을 읽어와서 array로 만든다.
    3. language 별로 구분하기하여 array 만들기

*/

//1. language code를 읽어와서 array로 만든다.
const rawLanguageCodesList = fs.readFileSync('./data/language_code.json')
const jsonLanguageCodeList = JSON.parse(rawLanguageCodesList)
const stringLanguageCodeList = []
for (languageCode of jsonLanguageCodeList) {
    stringLanguageCodeList.push(languageCode.code)
}

//2. 번역할 영어 파일을 읽어와서 array로 만든다
const rawEnglishSentenceList = fs.readFileSync('./data/english_values.json')
const jsonEnglishSentenceList = JSON.parse(rawEnglishSentenceList)

//3. language 별로 구분하기하여 array 만들기, merge
/* 
    Expected Output

    en: 
    [
        {
            name:
            text:
        },        
        {
            name:
            text:
        }, ...
    ]
*/
const languageCodeWithEnglishObject = []
for (languageCode of stringLanguageCodeList) {
    const emptyArray = []
    for (englishSentenceObject of jsonEnglishSentenceList) {
        emptyArray.push(englishSentenceObject)
    }
    let newObject = {}
    newObject[languageCode] = emptyArray
    languageCodeWithEnglishObject.push(newObject)
}

/*
[
    "key": [

    ],
    "key": [

    ]
]
*/


const executeTranslation = async () => {
    const backupJson = []
    let count = 0
    for (let i = 0; i < languageCodeWithEnglishObject.length - 1; i++) {

        for (languageCode in languageCodeWithEnglishObject[i]) {

            if(languageCode != "ko" && languageCode != "en" && languageCode != "fr") {
                const englishObjectList = languageCodeWithEnglishObject[i][languageCode]
                let xmlValuesString = `<?xml version="1.0" encoding="utf-8"?>\n`
                xmlValuesString += `<resources>\n`
                for (englishObject of englishObjectList) {
                    const name = englishObject.name
                    const value = englishObject.text
                    const translation = await translateText(value, languageCode)
                    backupJson.push({
                        languageCode: [
                            {
                                'name': name,
                                'text': translation
                            }
                        ]
                    })
                    xmlValuesString += `\t<string name="${name}">${translation}</string>\n`
                    count++
                }
                xmlValuesString += "</resources>"
                xmlValuesString = xmlValuesString.replace(/'/g, "\\'")
                const dir = `./xml/values-${languageCode}`
                if(!fs.existsSync(dir)){
                    fs.mkdirSync(dir)
                } 
                fs.writeFileSync(`./xml/values-${languageCode}/strings.xml`, xmlValuesString)
            }

        }
    }
    fs.writeFileSync(`./backup/backup.json`, JSON.stringify(backupJson))
    console.log('total loop::' + count)
}

executeTranslation()
