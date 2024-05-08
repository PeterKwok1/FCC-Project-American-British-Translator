'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body

      if (text === '') {
        res.json({ error: 'No text to translate' })
        return
      }

      if (locale !== 'american-to-british' && locale != 'british-to-american') {
        res.json({ error: 'Invalid value for locale field' })
        return
      }

      if (!text || !locale) {
        res.json({ error: 'Required field(s) missing' })
        return
      }

      let translation = translator.translate(text, locale)

      if (translation === text) {
        translation = 'Everything looks good to me!'
      }

      res.json({ text, translation })
    });
};
