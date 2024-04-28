const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    // deal with period
    // wrap translated word in a span with class 'highlight'
    // index takes inner html or an error obj 
    translate(string, direction) {
        // store punctuation 
        let regex = /[.?!]$/
        let punctuation = regex.test(string)[0] ? string.match(regex) : null
        string.replace(regex, '')

        // set sentence
        const sentence = string.split(' ')
        // set key
        const key = this.keyConstructor(direction)
        const keys = Object.keys(key)
        // translate
        let translation = []
        for (let word = 0; word < sentence.length; word++) {
            if (keys.includes(sentence[word])) {
                translation.push(key[sentence[word]])
            } else {
                translation.push(sentence[word])
            }
        }

        // add punctuation
        const newString = punctuation ? translation.join(' ') + punctuation
            : translation.join(' ')
        return newString
    }

    keyConstructor(direction) {
        if (direction === 'american-to-british') {
            return {
                ...americanOnly,
                ...americanToBritishSpelling,
                ...americanToBritishTitles
            }
        } else if (direction === 'british-to-american') {

        }
    }
}

module.exports = Translator;