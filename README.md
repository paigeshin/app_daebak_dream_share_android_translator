# How to use

.env 파일이 그대로 올라가서 api key 재발급 받고 다시 올림.


I. sophisticate data

- strings.xml => json using this website, [XML_TO_JSON](http://www.utilities-online.info/xmltojson/#.YAbGDi2l124) 
- put parsed json file in `/json` with name `raw.json`
- execute `jsonDataRefiner.js`
- output `/refinedJSON/refined.json`
```JSON
{
    "-name": "app_name",
    "text": "first application"
}

===================================>

{
    "name": "app_name",
    "text": "first application"
}
```

II. Preparation

- Change Name of `refined.json` into `english_values.json` 
- Put the file into `data/english_values.json`

III. language_code.json

- If you do not have `language_code.json` in `/data`, execute `languageListFetcher.js`.

IV. Use `/backup` and `androidStringXMLCreator.js` in order to modify some data.

1. Set Data format in `/data/english_values.json` following this structure   

```json
[
    {
        "name": "app_name",
        "text": "What did you do today?"
    },
    {
        "name": "google_banner_production",
        "text": "ca-app-pub-4343533631062740/7101403275"
    },
		...
] 
```

2. Execute `googleTranslator.js` 

# Learning

### `dotenv` module which enables `process.env`

```jsx
require('dotenv').config()
```

### Create `.env` file and put everything in one line

### `for in`

- retrieve key# app_daebaknaja_android_translator
