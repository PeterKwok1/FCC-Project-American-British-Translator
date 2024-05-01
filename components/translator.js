const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    // wrap translated word in a span with class 'highlight'
    // index takes inner html or an error obj 
    translate(string, direction) {

        // store punctuation 
        let regex = /[.?!]$/
        let punctuation = regex.test(string) ? string.match(regex)[0] : null
        string = string.replace(regex, '')

        // set sentence
        const sentence = string.split(' ')

        // set key
        const key = this.keyConstructor(direction)
        const keys = Object.keys(key)

        // translate
        let translation = []
        for (let word = 0; word < sentence.length; word++) {
            // Compare consecutive combinations
            let answer
            for (let phrase = sentence.length; phrase > word; phrase--) {
                const phraseString = sentence.slice(word, phrase).join(' ').toLowerCase()
                if (keys.includes(phraseString)) {
                    answer = key[phraseString]
                    // skip rest of phrase
                    word += (phrase - word - 1)
                    break
                }
            }
            if (!answer) {
                answer = sentence[word]
            }
            translation.push(answer)
            // console.log(translation)
        }

        // add punctuation
        const translatedString = punctuation ? translation.join(' ') + punctuation
            : translation.join(' ')
        return translatedString
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