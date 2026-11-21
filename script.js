const cards = [...document.querySelectorAll(".subject-card")];
const filters = document.querySelectorAll(".filter");
const studyDialog = document.querySelector("#studyDialog");
const studyTitle = document.querySelector("#studyTitle");
const studyMode = document.querySelector("#studyMode");
const studyContent = document.querySelector("#studyContent");
const closeStudyDialog = document.querySelector("#closeStudyDialog");

document.body.dataset.theme = "light";

function addStudyActions(card) {
  const subject = card.querySelector("h3").textContent.trim();
  const actions = document.createElement("div");
  actions.className = "study-actions";

  const button = document.createElement("button");
  button.className = "study-action";
  button.type = "button";
  button.innerHTML = '<i class="fa-solid fa-arrow-left-long" aria-hidden="true"></i> دخول المادة';
  button.addEventListener("click", () => openStudyDialog(subject));
  actions.append(button);
  card.append(actions);
}

function openStudyDialog(subject) {
  if (!window.studyData[subject] || !window.lessonData[subject]) {
    throw new Error(`Course content is missing for: ${subject}`);
  }

  studyTitle.textContent = subject;
  studyMode.textContent = "الأبواب والدروس";
  renderCourse(subject);
  studyDialog.showModal();
}

function renderCourse(subject) {
  studyContent.replaceChildren();
  const chapters = window.lessonData[subject];

  chapters.forEach((chapter, chapterIndex) => {
    const section = document.createElement("section");
    section.className = "lesson-chapter";
    section.id = `chapter-${chapterIndex}`;
    const heading = document.createElement("h3");
    heading.textContent = chapter.title;
    section.append(heading);

    chapter.lessons.forEach((lesson, lessonIndex) => {
      const lessonButton = document.createElement("button");
      lessonButton.className = "lesson-entry";
      lessonButton.type = "button";

      const lessonName = document.createElement("span");
      lessonName.className = "lesson-entry-name";
      lessonName.textContent = `الدرس ${lessonIndex + 1}: ${lesson.title}`;
      const lessonAction = document.createElement("span");
      lessonAction.className = "lesson-entry-action";
      lessonAction.textContent = "عرض الشرح";
      lessonButton.append(lessonName, lessonAction);
      lessonButton.addEventListener("click", () => {
        studyMode.textContent = "شرح الدرس";
        renderLesson(subject, chapterIndex, lessonIndex);
        studyDialog.scrollTop = 0;
      });
      section.append(lessonButton);
    });

    const quizButton = document.createElement("button");
    quizButton.className = "chapter-quiz-button";
    quizButton.type = "button";
    quizButton.textContent = "ابدأ اختبار الباب";
    quizButton.addEventListener("click", () => {
      studyMode.textContent = `اختبار ${chapter.title}`;
      renderQuiz({ subject, chapterIndex, questionIndex: 0, selectedIndex: null, score: 0 });
      studyDialog.scrollTop = 0;
    });
    section.append(quizButton);
    studyContent.append(section);
  });

  if (subject === "الأدب والمطالعة" && Array.isArray(window.poemGuides)) {
    const section = document.createElement("section");
    section.className = "lesson-chapter";
    const heading = document.createElement("h3");
    heading.textContent = "القصائد الشعرية";
    section.append(heading);

    const note = document.createElement("p");
    note.className = "poem-guide-note";
    note.textContent = "هذه ملاحظات دراسة أصلية ومعاني كلمات العناوين، وليست نصوص القصائد. أضف صفحات الأبيات لمراجعة مفرداتها وشرحها بيتًا بيتًا.";
    section.append(note);

    window.poemGuides.forEach((guide) => {
      const button = document.createElement("button");
      button.className = "lesson-entry";
      button.type = "button";
      const name = document.createElement("span");
      name.className = "lesson-entry-name";
      name.textContent = guide.title;
      const action = document.createElement("span");
      action.className = "lesson-entry-action";
      action.textContent = "عرض الدراسة";
      button.append(name, action);
      button.addEventListener("click", () => {
        studyMode.textContent = "دراسة قصيدة";
        renderPoemGuide(guide);
        studyDialog.scrollTop = 0;
      });
      section.append(button);
    });

    studyContent.append(section);
  }

  if (subject === "التربية الإسلامية") {
    if (!Array.isArray(window.surahAnNurVerses) || window.surahAnNurVerses.length !== 64) {
      throw new Error("Surah An-Nur content must contain all 64 verses");
    }

    const section = document.createElement("section");
    section.className = "lesson-chapter";
    const heading = document.createElement("h3");
    heading.textContent = "القرآن الكريم";
    const button = document.createElement("button");
    button.className = "lesson-entry";
    button.type = "button";
    const name = document.createElement("span");
    name.className = "lesson-entry-name";
    name.textContent = "سورة النور كاملة";
    const action = document.createElement("span");
    action.className = "lesson-entry-action";
    action.textContent = "64 آية";
    button.append(name, action);
    button.addEventListener("click", () => {
      studyMode.textContent = "سورة النور";
      renderSurahAnNur();
      studyDialog.scrollTop = 0;
    });
    section.append(heading, button);
    studyContent.append(section);
  }

  if (subject === "الدراسات الإسلامية") {
    if (!Array.isArray(window.surahMuhammadVerses) || window.surahMuhammadVerses.length !== 38) {
      throw new Error("Surah Muhammad content must contain all 38 verses");
    }

    const section = document.createElement("section");
    section.className = "lesson-chapter";
    const heading = document.createElement("h3");
    heading.textContent = "القرآن الكريم";
    const button = document.createElement("button");
    button.className = "lesson-entry";
    button.type = "button";
    const name = document.createElement("span");
    name.className = "lesson-entry-name";
    name.textContent = "سورة محمد كاملة";
    const action = document.createElement("span");
    action.className = "lesson-entry-action";
    action.textContent = "38 آية";
    button.append(name, action);
    button.addEventListener("click", () => {
      studyMode.textContent = "سورة محمد";
      renderSurahMuhammad();
      studyDialog.scrollTop = 0;
    });
    section.append(heading, button);
    studyContent.append(section);
  }
}

function renderPoemGuide(guide) {
  studyContent.replaceChildren();
  const article = document.createElement("article");
  article.className = "lesson-view";
  const heading = document.createElement("h3");
  heading.textContent = guide.title;
  article.append(heading);

  if (guide.poet) {
    const poet = document.createElement("p");
    poet.className = "lesson-view-chapter";
    poet.textContent = `الشاعر: ${guide.poet}`;
    article.append(poet);
  }

  const sections = [
    ["الفكرة العامة", guide.overview],
    ["طريقة الشرح والتحليل", guide.analysis]
  ];
  sections.forEach(([title, content]) => {
    const section = document.createElement("section");
    section.className = "lesson-explanation lesson-expanded";
    const subheading = document.createElement("h4");
    subheading.textContent = title;
    const paragraph = document.createElement("p");
    paragraph.textContent = content;
    section.append(subheading, paragraph);
    article.append(section);
  });

  const vocabularySection = document.createElement("section");
  vocabularySection.className = "lesson-explanation lesson-expanded";
  const vocabularyHeading = document.createElement("h4");
  vocabularyHeading.textContent = "معاني كلمات العنوان";
  const vocabularyList = document.createElement("ul");
  vocabularyList.className = "poem-vocabulary";
  guide.vocabulary.forEach(([word, meaning]) => {
    const item = document.createElement("li");
    const term = document.createElement("strong");
    term.textContent = `${word}: `;
    const definition = document.createElement("span");
    definition.textContent = meaning;
    item.append(term, definition);
    vocabularyList.append(item);
  });
  vocabularySection.append(vocabularyHeading, vocabularyList);
  article.append(vocabularySection);

  const back = document.createElement("button");
  back.className = "lesson-nav-button secondary";
  back.type = "button";
  back.textContent = "العودة إلى قائمة القصائد";
  back.addEventListener("click", () => {
    studyMode.textContent = "الأبواب والدروس";
    renderCourse("الأدب والمطالعة");
    studyDialog.scrollTop = 0;
  });
  const controls = document.createElement("div");
  controls.className = "lesson-controls";
  controls.append(back);
  article.append(controls);
  studyContent.append(article);
}

function renderSurahAnNur() {
  const verses = window.surahAnNurVerses;
  if (!Array.isArray(verses) || verses.length !== 64) {
    throw new Error("Surah An-Nur content must contain all 64 verses");
  }

  const article = document.createElement("article");
  article.className = "lesson-view surah-reading";
  const heading = document.createElement("h3");
  heading.textContent = "سورة النور";
  const note = document.createElement("p");
  note.className = "surah-reading-note";
  note.textContent = "نص السورة بالرسم العثماني — 64 آية";
  const basmalah = document.createElement("p");
  basmalah.className = "surah-basmalah";
  basmalah.textContent = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
  const list = document.createElement("p");
  list.className = "surah-verses";
  list.setAttribute("aria-label", "آيات سورة النور متتابعة");

  verses.forEach((verse, index) => {
    if (verse.number !== index + 1 || typeof verse.text !== "string" || !verse.text.trim()) {
      throw new Error(`Surah An-Nur contains invalid verse data at position ${index + 1}`);
    }

    list.append(document.createTextNode(`${verse.text} `));
    const number = document.createElement("span");
    number.className = "surah-verse-number";
    number.setAttribute("aria-label", `الآية ${verse.number}`);
    number.textContent = `﴿${verse.number.toLocaleString("ar")}﴾`;
    list.append(number, document.createTextNode(" "));
  });

  const back = document.createElement("button");
  back.className = "lesson-nav-button secondary";
  back.type = "button";
  back.textContent = "العودة إلى دروس التربية الإسلامية";
  back.addEventListener("click", () => {
    studyMode.textContent = "الأبواب والدروس";
    renderCourse("التربية الإسلامية");
    studyDialog.scrollTop = 0;
  });
  const controls = document.createElement("div");
  controls.className = "lesson-controls";
  controls.append(back);
  article.append(heading, note, basmalah, list, controls);
  studyContent.replaceChildren(article);
}

function renderSurahMuhammad() {
  const verses = window.surahMuhammadVerses;
  if (!Array.isArray(verses) || verses.length !== 38) {
    throw new Error("Surah Muhammad content must contain all 38 verses");
  }

  const article = document.createElement("article");
  article.className = "lesson-view surah-reading";
  const heading = document.createElement("h3");
  heading.textContent = "سورة محمد";
  const note = document.createElement("p");
  note.className = "surah-reading-note";
  note.textContent = "نص السورة بالرسم العثماني — 38 آية";
  const basmalah = document.createElement("p");
  basmalah.className = "surah-basmalah";
  basmalah.textContent = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
  const list = document.createElement("p");
  list.className = "surah-verses";
  list.setAttribute("aria-label", "آيات سورة محمد متتابعة");

  verses.forEach((verse, index) => {
    if (verse.number !== index + 1 || typeof verse.text !== "string" || !verse.text.trim()) {
      throw new Error(`Surah Muhammad contains invalid verse data at position ${index + 1}`);
    }

    list.append(document.createTextNode(`${verse.text} `));
    const number = document.createElement("span");
    number.className = "surah-verse-number";
    number.setAttribute("aria-label", `الآية ${verse.number}`);
    number.textContent = `﴿${verse.number.toLocaleString("ar")}﴾`;
    list.append(number, document.createTextNode(" "));
  });

  const back = document.createElement("button");
  back.className = "lesson-nav-button secondary";
  back.type = "button";
  back.textContent = "العودة إلى دروس الدراسات الإسلامية";
  back.addEventListener("click", () => {
    studyMode.textContent = "الأبواب والدروس";
    renderCourse("الدراسات الإسلامية");
    studyDialog.scrollTop = 0;
  });
  const controls = document.createElement("div");
  controls.className = "lesson-controls";
  controls.append(back);
  article.append(heading, note, basmalah, list, controls);
  studyContent.replaceChildren(article);
}

function renderLesson(subject, chapterIndex, lessonIndex) {
  const chapters = window.lessonData[subject];
  const chapter = chapters[chapterIndex];
  const lesson = chapter && chapter.lessons[lessonIndex];
  if (!lesson) {
    throw new Error(`Lesson content is missing for: ${subject} / ${chapterIndex} / ${lessonIndex}`);
  }

  const progress = document.createElement("p");
  progress.className = "lesson-progress";
  progress.textContent = `الباب ${chapterIndex + 1} من ${chapters.length} · الدرس ${lessonIndex + 1} من ${chapter.lessons.length}`;

  const lessonView = document.createElement("article");
  lessonView.className = "lesson-view";
  const chapterHeading = document.createElement("p");
  chapterHeading.className = "lesson-view-chapter";
  chapterHeading.textContent = chapter.title;
  const heading = document.createElement("h3");
  heading.textContent = lesson.title;
  const explanationSection = document.createElement("section");
  explanationSection.className = "lesson-explanation";
  const explanationHeading = document.createElement("h4");
  explanationHeading.textContent = "شرح الدرس";
  const explanation = document.createElement("p");
  explanation.textContent = lesson.text;
  explanationSection.append(explanationHeading, explanation);
  lessonView.append(chapterHeading, heading, explanationSection);

  if (lesson.expanded) {
    const expandedSection = document.createElement("section");
    expandedSection.className = "lesson-explanation lesson-expanded";
    const expandedHeading = document.createElement("h4");
    expandedHeading.textContent = "تفصيل الشرح";
    const expandedExplanation = document.createElement("p");
    expandedExplanation.textContent = lesson.expanded;
    expandedSection.append(expandedHeading, expandedExplanation);
    lessonView.append(expandedSection);
  }

  const illustrations = window.lessonIllustrations && window.lessonIllustrations[subject];
  const illustration = illustrations && illustrations[lesson.title];
  if (illustration) {
    const figure = document.createElement("figure");
    figure.className = "lesson-illustration";
    const diagram = document.createElement("div");
    diagram.className = "lesson-illustration-diagram";
    diagram.innerHTML = illustration.svg;
    const caption = document.createElement("figcaption");
    caption.textContent = illustration.caption;
    figure.append(diagram, caption);
    lessonView.append(figure);
  }

  const controls = document.createElement("div");
  controls.className = "lesson-controls";
  const previous = document.createElement("button");
  previous.className = "lesson-nav-button";
  previous.type = "button";
  previous.textContent = "الدرس السابق";
  previous.disabled = lessonIndex === 0;
  previous.addEventListener("click", () => {
    studyMode.textContent = "شرح الدرس";
    renderLesson(subject, chapterIndex, lessonIndex - 1);
    studyDialog.scrollTop = 0;
  });

  const backToChapter = document.createElement("button");
  backToChapter.className = "lesson-nav-button secondary";
  backToChapter.type = "button";
  backToChapter.textContent = "العودة إلى دروس الباب";
  backToChapter.addEventListener("click", () => {
    studyMode.textContent = "الأبواب والدروس";
    renderCourse(subject);
    studyContent.querySelector(`#chapter-${chapterIndex}`).scrollIntoView({ block: "start" });
  });

  const next = document.createElement("button");
  next.className = "lesson-nav-button";
  next.type = "button";
  next.textContent = "الدرس التالي";
  next.disabled = lessonIndex === chapter.lessons.length - 1;
  next.addEventListener("click", () => {
    studyMode.textContent = "شرح الدرس";
    renderLesson(subject, chapterIndex, lessonIndex + 1);
    studyDialog.scrollTop = 0;
  });

  controls.append(previous, backToChapter, next);
  studyContent.replaceChildren(progress, lessonView, controls);
}

function renderQuiz(state) {
  const chapter = window.lessonData[state.subject][state.chapterIndex];
  if (!chapter || !Array.isArray(chapter.quiz) || chapter.quiz.length === 0) {
    throw new Error(`Chapter quiz is missing for: ${state.subject}`);
  }

  const questions = chapter.quiz.map((questionIndex) => window.studyData[state.subject].quiz[questionIndex]);
  if (questions.some((question) => !question)) {
    throw new Error(`Quiz question is missing for: ${state.subject} / ${chapter.title}`);
  }

  if (state.questionIndex >= questions.length) {
    renderQuizResult(state, questions.length);
    return;
  }

  const question = questions[state.questionIndex];
  const progress = document.createElement("p");
  progress.className = "quiz-progress";
  progress.textContent = `السؤال ${state.questionIndex + 1} من ${questions.length}`;

  const prompt = document.createElement("h3");
  prompt.className = "quiz-question";
  prompt.textContent = question.question;

  const options = document.createElement("div");
  options.className = "quiz-options";
  const feedback = document.createElement("p");
  feedback.className = "quiz-feedback";
  feedback.setAttribute("role", "status");

  const nextButton = document.createElement("button");
  nextButton.className = "quiz-button";
  nextButton.type = "button";
  nextButton.textContent = state.questionIndex === questions.length - 1 ? "عرض النتيجة" : "السؤال التالي";
  nextButton.disabled = true;

  question.options.forEach((text, index) => {
    const option = document.createElement("button");
    option.className = "quiz-option";
    option.type = "button";
    option.textContent = text;
    option.addEventListener("click", () => {
      if (state.selectedIndex !== null) return;

      state.selectedIndex = index;
      const isCorrect = index === question.answer;
      if (isCorrect) state.score += 1;

      [...options.children].forEach((choice, choiceIndex) => {
        choice.disabled = true;
        if (choiceIndex === question.answer) choice.classList.add("correct");
        else if (choiceIndex === index) choice.classList.add("incorrect");
      });

      feedback.classList.add(isCorrect ? "correct" : "incorrect");
      feedback.textContent = `${isCorrect ? "إجابة صحيحة." : "إجابة غير صحيحة."} ${question.explanation}`;
      nextButton.disabled = false;
    });
    options.append(option);
  });

  nextButton.addEventListener("click", () => {
    state.questionIndex += 1;
    state.selectedIndex = null;
    renderQuiz(state);
  });

  studyContent.replaceChildren(progress, prompt, options, feedback);
  const controls = document.createElement("div");
  controls.className = "quiz-controls";
  controls.append(nextButton);
  studyContent.append(controls);
}

function renderQuizResult(state, total) {
  const result = document.createElement("div");
  result.className = "quiz-result";

  const heading = document.createElement("h3");
  heading.textContent = "اكتمل الاختبار";
  const score = document.createElement("p");
  score.className = "quiz-result-score";
  score.textContent = `${state.score} / ${total}`;
  const message = document.createElement("p");
  message.textContent = state.score === total
    ? "ممتاز! أجبت عن جميع الأسئلة بشكل صحيح."
    : "راجع دروس الباب والكتاب، ثم أعد المحاولة.";

  const controls = document.createElement("div");
  controls.className = "quiz-controls";
  const backToLessons = document.createElement("button");
  backToLessons.className = "quiz-button secondary";
  backToLessons.type = "button";
  backToLessons.textContent = "العودة إلى الأبواب";
  backToLessons.addEventListener("click", () => {
    studyMode.textContent = "الأبواب والدروس";
    renderCourse(state.subject);
    studyContent.querySelector(`#chapter-${state.chapterIndex}`).scrollIntoView({ block: "start" });
  });
  const retry = document.createElement("button");
  retry.className = "quiz-button";
  retry.type = "button";
  retry.textContent = "إعادة الاختبار";
  retry.addEventListener("click", () => {
    renderQuiz({
      subject: state.subject,
      chapterIndex: state.chapterIndex,
      questionIndex: 0,
      selectedIndex: null,
      score: 0
    });
  });
  controls.append(backToLessons, retry);
  result.append(heading, score, message, controls);
  studyContent.replaceChildren(result);
}

cards.forEach(addStudyActions);

let activeCategory = "all";

function applyFilters() {
  cards.forEach((card) => {
    card.hidden = activeCategory !== "all" && card.dataset.category !== activeCategory;
  });
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    applyFilters();
  });
});

closeStudyDialog.addEventListener("click", () => studyDialog.close());
studyDialog.addEventListener("click", (event) => {
  if (event.target === studyDialog) studyDialog.close();
});

