const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    translate(sentence, direction) {

        // store punctuation 
        let regex = /[.?!]$/
        let punctuation = regex.test(sentence) ? sentence.match(regex)[0] : null
        sentence = sentence.replace(regex, '')

        // translate 
        sentence = this.translateWords(sentence, direction)
        sentence = this.translateTime(sentence, direction)

        // add punctuation
        sentence = punctuation ? sentence + punctuation : sentence

        return sentence

    }

    translateWords(sentence, direction) {

        // set sentence
        sentence = sentence.split(' ')

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
                    // highlight
                    answer = this.highlight(key[phraseString])
                    // skip rest of phrase
                    word += (phrase - word - 1)
                    break
                }
            }
            if (!answer) {
                answer = sentence[word]
            }
            translation.push(answer)
        }

        translation = translation.join(' ')
        return translation
    }

    keyConstructor(direction) {
        if (direction === 'american-to-british') {
            return {
                ...americanOnly,
                ...americanToBritishSpelling,
                ...this.capitalizeValues(americanToBritishTitles)
            }
        } else if (direction === 'british-to-american') {
            // reverse key
            // js uses pass by reference so altering the obj here alters it's reference 
            // lowercase keys to fix capitalization after reversal
            let britishToAmericanSpelling = {}
            Object.keys(americanToBritishSpelling).map((e) => {
                britishToAmericanSpelling[americanToBritishSpelling[e]] = e
            })
            let britishToAmericanTitles = {}
            Object.keys(americanToBritishTitles).map((e) => {
                britishToAmericanTitles[americanToBritishTitles[e].toLowerCase()] = e
            })
            return {
                ...britishOnly,
                ...britishToAmericanSpelling,
                ...this.capitalizeValues(britishToAmericanTitles)
            }
        }
    }

    capitalizeValues(key) {
        const keys = Object.keys(key)
        for (let i = 0; i < keys.length; i++) {
            const firstLetter = key[keys[i]].charAt(0)
            const firstLetterCap = firstLetter.toUpperCase()
            const remainingLetters = key[keys[i]].slice(1)
            key[keys[i]] = firstLetterCap + remainingLetters
        }
        return key
    }

    translateTime(sentence, direction) {
        sentence = sentence.split(' ')

        // key
        let key
        let value
        if (direction === 'american-to-british') {
            key = /(\d+):(\d+)/g
            value = '.'
        } else if (direction === 'british-to-american') {
            key = /(\d+).(\d+)/g
            value = ':'
        }

        sentence = sentence.join(' ')
        const translation = sentence
            .replace(key, (match, p1, p2) => {
                return this.highlight(p1 + value + p2)
            })

        return translation
    }

    highlight(string) {
        // fcc needs this specific combination of quotes and spaces 
        return '<span class="highlight">' + string + '</span>'
    }
}

module.exports = Translator;