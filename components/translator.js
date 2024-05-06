const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    translate(string, direction) {
        // custom split with exclusions
        string = string.split(' ')

        // for each sentence, store punctuation, translate sentence,  

        // // store punctuation 
        // let regex = /[.?!]$/
        // let punctuation = regex.test(string) ? string.match(regex)[0] : null
        // string = string.replace(regex, '')

        // // translate time 
        // translation = this.translateTime(translation, direction)

        // // add punctuation
        // const translatedString = punctuation ? translation.join(' ') + punctuation
        //     : translation.join(' ')

        // return translatedString
    }

    translateSentence(sentence, direction) {
        let translation
        translation = this.translateWords(sentence, direction)
        translation = this.translateTime(sentence, direction)
        return translation
    }

    translateWords(sentence, direction) {
        // set sentence
        const sentence = sentence.split(' ')

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

        sentence = sentence.join(' ')
        return sentence
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
        let sentence = sentence.split(' ')

        let format
        let translation
        if (direction === 'american-to-british') {
            format = /(\d+):(\d+)/g
            translation = '.'
        } else if (direction === 'british-to-american') {
            format = /(\d+).(\d+)/g
            translation = ':'
        }

        for (let word = 0; word < sentence.length; word++) {
            sentence[word] = sentence[word].replace(format, (match, p1, p2) => {
                return this.highlight(p1 + translation + p2)
            })
        }

        sentence = sentence.join(' ')
        return sentence
    }

    highlight(string) {
        return '<span class = "highlight">' + string + '</span>'
    }
}

module.exports = Translator;