var translation = {
  source: {
    ml1: "Fuckbook - Are you looking for pleasure?",

    S0T1: "ADULTS ONLY",
    S0T2: "Warning!",
    S0T3: "Before we can show you a list and photos of women who live near you and are ready to have sex right now, we need to ask a few quick questions.",
    S0T4: "Continue",

    S1T1: "question 1",
    S1T2: "Many of these women are desperate single moms and cheating wives looking for some fun. They could be your neighbors or someone you know. Do you agree to keep the identity of these women a secret?",
    S1T3: "no",
    S1T4: "yes",

    S2T1: "question 2",
    S2T2: 'These women have asked us to not allow men that are seeking a "relationship". They only desire quick sex. Not dating. Do you agree to this request?',
    S2T3: "no",
    S2T4: "yes",

    S3T1: "question 3",
    S3T2: "Are you at least 18 years old? The women have requested that we not let those younger than 18 contact them because of past rude behavior by younger men.",
    S3T3: "no",
    S3T4: "yes",

    S4T1: "Thank you!",
    S4T2: 'You may now see our list and photos of women who are in your area. Again, please keep their identity a secret. Click on the "CONTINUE" button and search on the basis of your answers.',
    S4T3: "Continue",
  },
  ru: {
    ml1: "Fuckbook - Are you looking for pleasure?",

    S0T1: "только для взрослых",
    S0T2: "Внимание!",
    S0T3: "Прежде чем мы покажем вам лучшие профайлы наших подписчиц, которые хотят новых впечатлений, нам нужно задать несколько простых вопросов.",
    S0T4: "Продолжить",

    S1T1: "Вопрос 1",
    S1T2: "Многие из наших участниц ищут возможность приятно провести время. Они могут быть вашими соседями или знакомыми. Вы готовы сохранить их личность в тайне?",
    S1T3: "Нет",
    S1T4: "Да",

    S2T1: "Вопрос 2",
    S2T2: "Наши посетительницы не хотят серьезных отношений. Они ищут лишь быстрый секс без обязательств. Согласны ли вы с этим?",
    S2T3: "Нет",
    S2T4: "Да",

    S3T1: "Вопрос 3",
    S3T2: "Вам по крайней мере 18 лет? Женщины просили, чтобы мы не позволяли молодым людям связаться с ними из-за грубого поведения молодых людей.",
    S3T3: "Нет",
    S3T4: "Да",

    S4T1: "Спасибо!",
    S4T2: "Сейчас мы можем показать вам профили наших участниц. Пожалуйста, сохраняйте их личность и их секреты в тайне.",
    S4T3: "Продолжить",
  },
  de: {
    ml1: "Fuckbook - Are you looking for pleasure?",

    S0T1: "nur für Erwachsene",
    S0T2: "Warnung!",
    S0T3: "Bevor wir Ihnen eine Auswahl passender Sexpartner zeigen können, bitten wir Sie die folgenden Fragen ehrlich und gewissenhaft zu beantworten.",
    S0T4: "Weiter",

    S1T1: "frage 1",
    S1T2: "Viele der Frauen sind sexuell unbefriedigte Hausfrauen und Mütter aus Ihrer direkten Umgebung. Es könnte z.B. eine Nachbarin oder auch die Kassiererin vom Supermarkt sein. Versprechen Sie die Identität Ihrer Sexpartner geheim halten?",
    S1T3: "Nein",
    S1T4: "Ja",

    S2T1: "frage 2",
    S2T2: "Diese sexbereiten Frauen suchen nur körperlichen Spaß und KEINE Beziehung. Sind Sie damit einverstanden Gefühle und Sex zu trennen?",
    S2T3: "Nein",
    S2T4: "Ja",

    S3T1: "frage 3",
    S3T2: "Aufgrund von miserablem Verhalten dürfen wir nur noch Männer über 18 Jahren Zutritt gewähren. Sind Sie 18 Jahre oder älter?",
    S3T3: "Nein",
    S3T4: "Ja",

    S4T1: "Vielen Dank!",
    S4T2: "Du kannst nun unsere Liste und unsere Fotos von Frauen sehen, die in deiner Nähe sind. Wie gesagt, halte die Identität der Frauen geheim.",
    S4T3: "Weiter",
  },
};

function replace_text(lang, text) {
  x = document.getElementById(text);
  if (x) {
    if (x.tagName === "INPUT") {
      x.placeholder = translation[lang][text];
    } else {
      x.innerHTML = translation[lang][text];
    }
  } else {
    document.getElementById("hideBody").style.display = "block";
    return "source";
  }
}

function translation_available(lang) {
  if (translation[lang]) {
    return lang;
  } else {
    document.getElementById("hideBody").style.display = "block";
  }
}

function detect_language() {
  var detected_language = window.navigator
    ? window.navigator.language ||
      window.navigator.systemLanguage ||
      window.navigator.userLanguage
    : "es";
  detected_language = detected_language.substr(0, 2).toLowerCase();

  return translation_available(detected_language);
}

function translate() {
  var detected_language = detect_language();
  for (y in translation["source"]) {
    replace_text(detected_language, y);
  }
  document.getElementById("hideBody").style.display = "block";
}
