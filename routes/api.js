'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();

  // Mangoes are my favorite fruit.
  // We watched the footie match for a while.
  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body
      const translation = translator.translate(text, locale)
      res.json({ text, translation })
    });
};
