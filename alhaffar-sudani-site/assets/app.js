/* الحفار السوداني — محرك الموقع: الوضع الفاتح/المظلم، عرض المواد، الاختبارات */
(function () {
  'use strict';

  var SITE = (window.SITE = window.SITE || { subjects: [] });
  var BRAND = 'الحفار السوداني';
  var AUTHOR = 'basheer hamid';
  var LINKS = {
    wa: 'https://wa.me/qr/M4C46RFHPB55M1',
    mail: 'mailto:b2s7eer@gmail.com',
    ig: 'https://www.instagram.com/bas7eer_1?avpt=ZDMxYXgwOW4zOGdu'
  };
  var CATEGORIES = [
    { id: 'core', title: 'المواد الأساسية', en: 'Core Subjects', icon: 'fa-book-open', desc: 'المواد المشتركة بين جميع الطلاب: اللغة العربية، الإنجليزية، التربية الإسلامية، الرياضيات وعلوم الحاسوب.' },
    { id: 'science', title: 'المواد العلمية', en: 'Science Subjects', icon: 'fa-flask', desc: 'مواد القسم العلمي: الفيزياء، الكيمياء، الأحياء والرياضيات المتخصصة.' },
    { id: 'arts', title: 'المواد الأدبية', en: 'Arts Subjects', icon: 'fa-landmark', desc: 'مواد القسم الأدبي: التاريخ، الجغرافيا والاقتصاد.' }
  ];
  var THEME_KEY = 'hafar-theme';

  /* ---------- أدوات ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // النص بين علامتي ` يُعرض كعبارة LTR (معادلات، كلمات إنجليزية)
  function fmt(s) {
    return esc(s).replace(/`([^`]+)`/g, '<span class="m" dir="ltr">$1</span>');
  }
  function shuffle(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function range(n) { var r = [], i; for (i = 0; i < n; i++) r.push(i); return r; }
  function subjectsOf(cat) { return SITE.subjects.filter(function (s) { return s.cat === cat; }); }
  function findSubject(id) {
    for (var i = 0; i < SITE.subjects.length; i++) if (SITE.subjects[i].id === id) return SITE.subjects[i];
    return null;
  }
  function catOf(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
    return null;
  }
  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function scrollTo(el) {
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------- الوضع الفاتح / المظلم ---------- */
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* التخزين غير متاح */ }
    syncToggle();
  }
  function syncToggle() {
    var b = $('#theme-toggle');
    if (!b) return;
    var light = currentTheme() === 'light';
    var label = light ? 'التبديل إلى الوضع المظلم' : 'التبديل إلى الوضع الفاتح';
    b.setAttribute('aria-label', label);
    b.setAttribute('title', label);
  }

  /* ---------- الهيدر والفوتر ---------- */
  var SUN = '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function mountChrome(active) {
    var top = $('#top');
    if (top) {
      var items = [
        ['home', 'index.html', 'الرئيسية', 'الرئيسية'],
        ['materials', 'materials.html', 'المواد الدراسية', 'المواد'],
        ['contact', 'contact.html', 'تواصل معنا', 'تواصل']
      ];
      var nav = items.map(function (it) {
        return '<a href="' + it[1] + '"' + (it[0] === active ? ' class="active" aria-current="page"' : '') + ' aria-label="' + it[2] + '">' +
          '<span class="nl">' + it[2] + '</span><span class="ns" aria-hidden="true">' + it[3] + '</span></a>';
      }).join('');
      var backButton = active === 'home' ? '' :
        '<button type="button" class="back-button" id="back-button" aria-label="الرجوع للصفحة السابقة" title="رجوع">' +
          '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i><span>رجوع</span>' +
        '</button>';
      top.outerHTML =
        '<header class="topbar">' +
          '<a class="brand" href="index.html"><span class="brand-mark"><i class="fa-solid fa-graduation-cap"></i></span><span>' + BRAND + '</span></a>' +
          '<nav>' + backButton + nav +
            '<button type="button" class="theme-toggle" id="theme-toggle">' + SUN + MOON + '</button>' +
          '</nav>' +
        '</header>';
      var back = $('#back-button');
      if (back) {
        back.addEventListener('click', function () {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            var page = document.body.getAttribute('data-page');
            window.location.href = page === 'subject' ? 'materials.html' : 'index.html';
          }
        });
      }
      var btn = $('#theme-toggle');
      btn.addEventListener('click', function () { setTheme(currentTheme() === 'light' ? 'dark' : 'light'); });
      syncToggle();
    }
    var foot = $('#foot');
    if (foot) {
      foot.outerHTML =
        '<footer><p>© ' + new Date().getFullYear() + ' <span class="mark">' + BRAND + '</span> — إعداد ' +
        '<span dir="ltr">' + AUTHOR + '</span> — جميع الحقوق محفوظة</p></footer>';
    }
  }

  function contactRow() {
    return '<div class="social-row">' +
      '<a class="social-btn" href="' + LINKS.wa + '" target="_blank" rel="noopener" aria-label="واتساب"><i class="fa-brands fa-whatsapp"></i><span>واتساب</span></a>' +
      '<a class="social-btn" href="' + LINKS.mail + '" aria-label="البريد الإلكتروني"><i class="fa-solid fa-envelope"></i><span>البريد الإلكتروني</span></a>' +
      '<a class="social-btn" href="' + LINKS.ig + '" target="_blank" rel="noopener" aria-label="إنستغرام"><i class="fa-brands fa-instagram"></i><span>إنستغرام</span></a>' +
    '</div>';
  }

  /* ---------- الصفحة الرئيسية ---------- */
  function pageHome() {
    var mount = $('#cats');
    if (mount) {
      mount.innerHTML = CATEGORIES.map(function (c) {
        var n = subjectsOf(c.id).length;
        return '<div class="card">' +
          '<div class="icon-wrap"><i class="fa-solid ' + c.icon + '"></i></div>' +
          '<h3>' + c.title + '</h3>' +
          '<p class="tag">' + c.en + '</p>' +
          '<p class="desc">' + c.desc + '</p>' +
          '<p class="meta">' + n + ' مواد</p>' +
          '<div class="actions"><a class="btn btn-primary" href="materials.html#' + c.id + '"><i class="fa-solid fa-arrow-left-long"></i> استعرض المواد</a></div>' +
        '</div>';
      }).join('');
    }
    var cm = $('#contact-mount');
    if (cm) cm.innerHTML = contactRow();
  }

  /* ---------- صفحة المواد ---------- */
  function pageMaterials() {
    var tabsEl = $('#cat-tabs'), listEl = $('#subject-list');
    if (!tabsEl || !listEl) return;
    var active = (location.hash || '').replace('#', '');
    if (!catOf(active)) active = CATEGORIES[0].id;

    function render() {
      tabsEl.innerHTML = CATEGORIES.map(function (c) {
        return '<button type="button" class="tab" role="tab" data-cat="' + c.id + '" aria-selected="' + (c.id === active) + '">' +
          '<i class="fa-solid ' + c.icon + '"></i>' + c.title + '</button>';
      }).join('');
      var subs = subjectsOf(active);
      listEl.innerHTML = subs.length ? subs.map(function (s) {
        return '<div class="card">' +
          '<div class="icon-wrap"><i class="fa-solid ' + s.icon + '"></i></div>' +
          '<h3>' + esc(s.title) + '</h3>' +
          '<p class="tag">' + esc(s.en) + '</p>' +
          '<p class="meta">' + s.sections.length + ' محاور · ' + s.quiz.length + ' أسئلة</p>' +
          '<div class="actions row">' +
            '<a class="btn btn-primary" href="subject.html?s=' + s.id + '"><i class="fa-solid fa-book"></i> الملخص</a>' +
            '<a class="btn btn-outline" href="subject.html?s=' + s.id + '#quiz"><i class="fa-solid fa-pen-to-square"></i> اختبار</a>' +
          '</div></div>';
      }).join('') : '<p class="empty">لا توجد مواد في هذا القسم بعد.</p>';
    }
    tabsEl.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.tab') : null;
      if (!b) return;
      active = b.getAttribute('data-cat');
      try { history.replaceState(null, '', '#' + active); } catch (err) { location.hash = active; }
      render();
    });
    window.addEventListener('hashchange', function () {
      var h = (location.hash || '').replace('#', '');
      if (catOf(h) && h !== active) { active = h; render(); }
    });
    render();
  }

  /* ---------- صفحة المادة ---------- */
  function pageSubject() {
    var root = $('#subject-root');
    if (!root) return;
    var id = new URLSearchParams(location.search).get('s');
    var s = findSubject(id);
    if (!s) {
      root.innerHTML = '<section><p class="empty">المادة المطلوبة غير موجودة. <a class="accent" href="materials.html">العودة إلى المواد</a></p></section>';
      return;
    }
    document.title = s.title + ' | ' + BRAND;
    var cat = catOf(s.cat);

    root.innerHTML =
      '<div class="hero compact">' +
        '<div class="hero-icon"><i class="fa-solid ' + s.icon + '"></i></div>' +
        '<div class="eyebrow"><i class="fa-solid ' + cat.icon + '"></i> ' + cat.title + '</div>' +
        '<h1><span class="accent">' + esc(s.title) + '</span></h1>' +
        '<p class="en-tag">' + esc(s.en) + '</p>' +
        '<p>' + fmt(s.intro) + '</p>' +
      '</div>' +
      '<section>' +
        '<div class="tabs" role="tablist">' +
          '<button type="button" class="tab" role="tab" id="tab-sum" aria-controls="panel-sum"><i class="fa-solid fa-book"></i> الملخص</button>' +
          '<button type="button" class="tab" role="tab" id="tab-quiz" aria-controls="panel-quiz"><i class="fa-solid fa-pen-to-square"></i> الاختبار</button>' +
        '</div>' +
        '<div class="content-wrap">' +
          '<div id="panel-sum" role="tabpanel" aria-labelledby="tab-sum"></div>' +
          '<div id="panel-quiz" role="tabpanel" aria-labelledby="tab-quiz" hidden></div>' +
          '<p class="disclaimer">الملخصات والأسئلة من إعداد الموقع لمساعدتك على المراجعة، وليست نسخة من الكتاب المدرسي. اعتمد دائمًا على المقرر الرسمي.</p>' +
        '</div>' +
      '</section>';

    $('#panel-sum').innerHTML = s.sections.map(function (sec, i) {
      return '<div class="topic"><h3><span class="num">' + (i + 1) + '</span>' + fmt(sec.title) + '</h3>' +
        '<ul>' + sec.points.map(function (p) { return '<li>' + fmt(p) + '</li>'; }).join('') + '</ul>' +
        (sec.note ? '<div class="note">' + fmt(sec.note) + '</div>' : '') + '</div>';
    }).join('');

    var quizReady = false;
    function show(which, push) {
      var sum = which === 'sum';
      $('#panel-sum').hidden = !sum;
      $('#panel-quiz').hidden = sum;
      $('#tab-sum').setAttribute('aria-selected', sum);
      $('#tab-quiz').setAttribute('aria-selected', !sum);
      if (!sum && !quizReady) { quizReady = true; initQuiz(s, $('#panel-quiz')); }
      if (push) { try { history.replaceState(null, '', sum ? location.pathname + location.search : '#quiz'); } catch (e) { /* تجاهل */ } }
    }
    $('#tab-sum').addEventListener('click', function () { show('sum', true); });
    $('#tab-quiz').addEventListener('click', function () { show('quiz', true); });
    show(location.hash === '#quiz' ? 'quiz' : 'sum', false);
  }

  /* ---------- محرك الاختبار ---------- */
  function quoteFor(pct) {
    if (pct >= 90) return 'ممتاز! مستواك رائع، حافظ على هذا الأداء وراجع الأخطاء القليلة.';
    if (pct >= 75) return 'جيد جدًا! أنت قريب من القمة، راجع الأسئلة التي أخطأت فيها وأعد المحاولة.';
    if (pct >= 50) return 'مستوى مقبول. ارجع إلى الملخص وركّز على المحاور التي تحتاج مراجعة ثم أعد الاختبار.';
    return 'لا تقلق، البداية دائمًا صعبة. ابدأ بقراءة الملخص بتأنٍّ ثم أعد المحاولة وسترى الفرق.';
  }

  function initQuiz(subject, mount) {
    var Q = subject.quiz, N = Q.length, state = null;

    mount.innerHTML =
      '<div id="qz-intro" class="quiz-intro">' +
        '<div class="quiz-intro-icon">🧠</div>' +
        '<h3>اختبر نفسك في ' + esc(subject.title) + '</h3>' +
        '<p>أجب عن جميع الأسئلة ثم اضغط «إنهاء الاختبار» لتعرف نتيجتك.</p>' +
        '<div class="quiz-stats">' +
          '<div class="quiz-stat"><b>' + N + '</b><span>سؤال</span></div>' +
          '<div class="quiz-stat"><b>4</b><span>خيارات لكل سؤال</span></div>' +
          '<div class="quiz-stat"><b>∞</b><span>محاولات</span></div>' +
        '</div>' +
        '<button type="button" class="btn-pill" id="qz-start">ابدأ الاختبار</button>' +
      '</div>' +
      '<div id="qz-active" hidden>' +
        '<div class="quiz-progress"><div class="quiz-progress-bar"><div class="quiz-progress-fill" id="qz-fill"></div></div>' +
        '<div class="quiz-progress-label" id="qz-label"></div></div>' +
        '<div id="qz-list"></div>' +
        '<div class="quiz-submit-bar"><button type="button" class="btn-pill" id="qz-submit" disabled>إنهاء الاختبار</button>' +
        '<div class="quiz-hint" id="qz-hint"></div></div>' +
      '</div>' +
      '<div id="qz-results" hidden></div>';

    var elIntro = $('#qz-intro', mount), elActive = $('#qz-active', mount), elResults = $('#qz-results', mount);
    var elList = $('#qz-list', mount), elFill = $('#qz-fill', mount), elLabel = $('#qz-label', mount);
    var elSubmit = $('#qz-submit', mount), elHint = $('#qz-hint', mount);

    function stage(name) {
      elIntro.hidden = name !== 'intro';
      elActive.hidden = name !== 'active';
      elResults.hidden = name !== 'results';
      scrollTo(mount);
    }

    function qCard(item, idx, review) {
      var q = Q[item.qi];
      var correctPos = item.perm.indexOf(q.a);
      var opts = item.perm.map(function (origIdx, pos) {
        var cls = 'q-opt', mark = '';
        if (review) {
          cls += ' disabled';
          if (pos === correctPos) { cls += ' correct'; mark = '<span class="q-mark">✓ الإجابة الصحيحة</span>'; }
          else if (pos === item.picked) { cls += ' incorrect'; mark = '<span class="q-mark">✗ إجابتك</span>'; }
        } else if (pos === item.picked) cls += ' selected';
        return '<label class="' + cls + '"><input type="radio" name="q' + idx + '" value="' + pos + '"' +
          (pos === item.picked ? ' checked' : '') + (review ? ' disabled' : '') + '>' +
          '<span dir="auto">' + fmt(q.o[origIdx]) + '</span>' + mark + '</label>';
      }).join('');
      return '<div class="q-card' + (review || item.picked !== null ? '' : ' unanswered') + '" id="' + (review ? 'rv' : 'qc') + idx + '">' +
        '<div class="q-head"><span class="q-index">' + (idx + 1) + '/' + N + '</span><span class="q-text" dir="auto">' + fmt(q.q) + '</span></div>' +
        '<div class="q-opts">' + opts + '</div>' +
        (review && q.why ? '<div class="q-why"><strong>الشرح:</strong> ' + fmt(q.why) + '</div>' : '') +
      '</div>';
    }

    function answered() { return state.items.filter(function (it) { return it.picked !== null; }).length; }

    function updateProgress() {
      var a = answered();
      elFill.style.width = Math.round((a / N) * 100) + '%';
      elLabel.textContent = 'تمت الإجابة عن ' + a + ' من ' + N;
      elSubmit.disabled = a < N;
      elHint.textContent = a < N ? 'أجب عن جميع الأسئلة لتتمكن من إنهاء الاختبار.' : 'أحسنت! يمكنك الآن إنهاء الاختبار.';
    }

    function start() {
      state = {
        items: shuffle(range(N)).map(function (qi) {
          return { qi: qi, perm: shuffle(range(Q[qi].o.length)), picked: null };
        })
      };
      elList.innerHTML = state.items.map(function (it, i) { return qCard(it, i, false); }).join('');
      updateProgress();
      stage('active');
    }

    elList.addEventListener('change', function (e) {
      var t = e.target;
      if (!t || t.type !== 'radio') return;
      var idx = parseInt(t.name.slice(1), 10);
      state.items[idx].picked = parseInt(t.value, 10);
      var card = $('#qc' + idx, mount);
      card.classList.remove('unanswered');
      Array.prototype.forEach.call(card.querySelectorAll('.q-opt'), function (l) {
        l.classList.toggle('selected', l.querySelector('input').checked);
      });
      updateProgress();
    });

    function score() {
      return state.items.reduce(function (n, it) {
        return n + (it.picked === it.perm.indexOf(Q[it.qi].a) ? 1 : 0);
      }, 0);
    }

    function submit() {
      var sc = score(), pct = Math.round((sc / N) * 100);
      elResults.innerHTML =
        '<div class="result-card">' +
          '<div class="result-score">' + sc + '/' + N + '</div>' +
          '<div class="result-pct">' + pct + '٪ إجابات صحيحة</div>' +
          '<div class="result-quote">' + quoteFor(pct) + '</div>' +
          '<div class="result-actions">' +
            '<button type="button" class="btn-pill" id="qz-review">مراجعة الإجابات</button>' +
            '<button type="button" class="btn-ghost" id="qz-retry">إعادة الاختبار</button>' +
          '</div>' +
        '</div>' +
        '<div id="qz-review-box"></div>';
      $('#qz-retry', mount).addEventListener('click', start);
      $('#qz-review', mount).addEventListener('click', function () {
        var box = $('#qz-review-box', mount);
        box.innerHTML = '<div class="review-title">مراجعة الإجابات</div>' +
          state.items.map(function (it, i) { return qCard(it, i, true); }).join('');
        scrollTo(box);
      });
      stage('results');
    }

    $('#qz-start', mount).addEventListener('click', start);
    elSubmit.addEventListener('click', function () { if (answered() === N) submit(); });
  }

  /* ---------- التشغيل ---------- */
  function init() {
    var page = document.body.getAttribute('data-page') || 'home';
    mountChrome(page === 'subject' ? 'materials' : page);
    if (page === 'home') pageHome();
    else if (page === 'materials') pageMaterials();
    else if (page === 'subject') pageSubject();
    else if (page === 'contact') { var cm = $('#contact-mount'); if (cm) cm.innerHTML = contactRow(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
