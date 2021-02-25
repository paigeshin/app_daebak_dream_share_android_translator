// data르 예쁘게 바꿔준다. 

const fs = require('fs')

const jsonString = fs.readFileSync(`./json/raw.json`)
const jsonList = JSON.parse(jsonString)

/*
    {
        "-name": "app_name",
        "#text": "What did you do?"
    },

=================================================>>>

    {
        "name": "app_name"
        "text": "What did you do?"
    }

*/

const refinedJson = []
for(json of jsonList) {
    refinedJson.push({
        'name': json['-name'],
        'text': json['#text']
    })
}

fs.writeFileSync('./data/refined.json', JSON.stringify(refinedJson))