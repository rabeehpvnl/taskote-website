(function () {
  var cfg = window.JOBCO_CONFIG || {};
  var origin = (cfg.APP_ORIGIN || '').replace(/\/+$/, '');
  var paths = cfg.APP_PATHS || {};
  var isMalayalam = document.documentElement.lang === 'ml';
  var isEnPrefix = location.pathname.startsWith('/en/') || location.pathname === '/en';

  var t = isMalayalam ? {
    all: 'ലിസ്റ്റ് ചെയ്തിട്ടുള്ള എട്ട് സർവീസുകളും താഴെ കാണാം.',
    none: 'പൊരുത്തപ്പെടുന്ന സർവീസുകൾ കണ്ടെത്താനായില്ല.',
    one: '1 സർവീസ് കണ്ടെത്തി.',
    many: ' സർവീസുകൾ കണ്ടെത്തി.',
    disconnected: 'ഈ ഫോം നിലവിൽ ആപ്പുമായി ബന്ധിപ്പിച്ചിട്ടില്ല. ടാസ്കോട്ടിന്റെ ഔദ്യോഗിക വിലാസങ്ങൾ സ്ഥിരീകരിച്ച ശേഷം ലഭ്യമാക്കുന്നതാണ്.',
    sending: 'അയയ്ക്കുന്നു…',
    sent: 'സന്ദേശം അയച്ചു. നന്ദി.',
    failed: 'സന്ദേശം അയയ്ക്കാനായില്ല. ദയവായി അല്പം കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുകയോ നൽകിയിട്ടുള്ള വിവരങ്ങളിൽ ബന്ധപ്പെടുകയോ ചെയ്യുക.',
    validation: 'നിങ്ങളുടെ പേരും ശരിയായ ഇമെയിൽ വിലാസവും സന്ദേശവും ദയവായി നൽകുക.'
  } : {
    all: 'Showing all eight services.',
    none: 'No matching services.',
    one: ' matching service.',
    many: ' matching services.',
    disconnected: 'This form is not connected yet. Taskote contact details have not been confirmed for publication.',
    sending: 'Sending…',
    sent: 'Message sent. Thank you.',
    failed: 'Your message could not be sent. Please try again later or use the contact details above.',
    validation: 'Please enter your name, a valid email address, and a message.'
  };

  var localePrefix = isMalayalam ? '/ml' : (isEnPrefix ? '/en' : '');

  // 1. WhatsApp click & launch notice handling
  var waNotice = document.getElementById('whatsapp-notice');
  var waNoticeClose = document.getElementById('whatsapp-notice-close');
  if (waNoticeClose && waNotice) {
    waNoticeClose.addEventListener('click', function () {
      waNotice.hidden = true;
    });
  }

  document.querySelectorAll('a[href="#whatsapp-notice"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (waNotice) {
        waNotice.hidden = false;
        waNotice.focus();
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && waNotice && !waNotice.hidden) {
      waNotice.hidden = true;
    }
  });

  // 2. Mobile menu
  var btn = document.getElementById('menu-btn'), menu = document.getElementById('site-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open)); menu.classList.toggle('open', !open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { btn.click(); btn.focus(); }
    });
  }

  // 3. Accordions
  document.querySelectorAll('.acc-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      document.getElementById(b.getAttribute('aria-controls')).hidden = open;
    });
  });

  // 4. FAQ category tabs
  var tabs = document.querySelectorAll('[role=tab]');
  var tabList = document.querySelector('[role=tablist]');
  function syncTabOrientation() {
    if (tabList) tabList.setAttribute('aria-orientation', window.matchMedia('(max-width: 640px)').matches ? 'horizontal' : 'vertical');
  }
  syncTabOrientation();
  window.addEventListener('resize', syncTabOrientation);
  function pick(t) {
    tabs.forEach(function (x) {
      var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (n) { e.preventDefault(); var x = tabs[(i + n + tabs.length) % tabs.length]; pick(x); x.focus(); }
    });
  });
  if (location.hash && document.querySelector('[role=tab][data-key="' + location.hash.slice(1) + '"]')) {
    pick(document.querySelector('[data-key="' + location.hash.slice(1) + '"]'));
  }

  // 5. Service finder (discovery only, no booking)
  var finder = document.getElementById('finder');
  if (finder) {
    finder.addEventListener('submit', function (e) {
      e.preventDefault();
      var service = finder.elements.service.value;
      location.href = localePrefix + '/services/' + encodeURIComponent(service) + '/';
    });
  }

  // 6. Service directory filter (search only; category links remain the navigation)
  var serviceFilter = document.getElementById('service-filter');
  if (serviceFilter) {
    var query = document.getElementById('service-query');
    var cards = Array.prototype.slice.call(document.querySelectorAll('#service-directory-grid [data-service-card]'));
    var status = document.getElementById('service-filter-status');
    var empty = document.getElementById('service-empty');
    serviceFilter.addEventListener('submit', function (e) {
      e.preventDefault();
      var grid = document.getElementById('service-directory-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    query.addEventListener('input', function () {
      var term = query.value.trim().toLocaleLowerCase();
      var matches = 0;
      cards.forEach(function (card) {
        var found = !term || (card.getAttribute('data-search') || '').toLocaleLowerCase().includes(term);
        card.hidden = !found;
        if (found) matches += 1;
      });
      empty.hidden = matches > 0;
      if (!term) status.textContent = t.all;
      else if (!matches) status.textContent = t.none;
      else if (isMalayalam) status.textContent = matches === 1 ? t.one : matches + t.many;
      else status.textContent = 'Showing ' + matches + (matches === 1 ? t.one : t.many);
    });
  }

  // 7. Contact form: never pretends to send
  var cf = document.getElementById('contact-form');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = document.getElementById('form-status');
      if (!cf.checkValidity()) {
        out.className = 'status warn'; out.textContent = t.validation;
        var invalid = cf.querySelector(':invalid'); if (invalid) invalid.focus();
        return;
      }
      if (!cfg.CONTACT_ENDPOINT) {
        out.className = 'status warn';
        out.textContent = t.disconnected;
        return;
      }
      out.className = 'status'; out.textContent = t.sending;
      fetch(cfg.CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(cf)))
      })
      .then(function (r) { if (!r.ok) throw 0; out.className = 'status ok'; out.textContent = t.sent; cf.reset(); })
      .catch(function () { out.className = 'status warn'; out.textContent = t.failed; });
    });
  }
})();
