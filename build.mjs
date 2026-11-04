// Taskote public website: static generator. No dependencies. Run: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WHATSAPP_CONFIG, buildWhatsAppUrl, isWhatsAppConfigured, CONTACT_EMAIL } from './whatsapp.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = __dirname;
const OUT = path.join(ROOT_DIR, 'dist');
const ENGLISH_ONLY = process.argv.includes('--english-only');
const CONTACT_ENDPOINT = (process.env.JOBCO_CONTACT_ENDPOINT || '').trim();
const SITE_URL = (process.env.JOBCO_SITE_URL || '').trim();

const CONTACT = {
  email: CONTACT_EMAIL,
  phone: 'WhatsApp Business',
  hours: 'WhatsApp Support available across Kerala',
  place: 'Kerala, India'
};

/* ---------- Load centralized content ---------- */
function loadContent(locale) {
  const dir = path.join(ROOT_DIR, 'content', locale);
  return {
    common: JSON.parse(fs.readFileSync(path.join(dir, 'common.json'), 'utf8')),
    home: JSON.parse(fs.readFileSync(path.join(dir, 'home.json'), 'utf8')),
    about: JSON.parse(fs.readFileSync(path.join(dir, 'about.json'), 'utf8')),
    services: JSON.parse(fs.readFileSync(path.join(dir, 'services.json'), 'utf8')),
    categories: JSON.parse(fs.readFileSync(path.join(dir, 'categories.json'), 'utf8')),
    faq: JSON.parse(fs.readFileSync(path.join(dir, 'faq.json'), 'utf8')),
    contact: JSON.parse(fs.readFileSync(path.join(dir, 'contact.json'), 'utf8')),
    auth: JSON.parse(fs.readFileSync(path.join(dir, 'auth.json'), 'utf8')),
    join: JSON.parse(fs.readFileSync(path.join(dir, 'join.json'), 'utf8'))
  };
}

const enContent = loadContent('en');
const mlContent = loadContent('ml');

/* ---------- Helpers & URL routing ---------- */
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function routeFor(baseRoute, locale, rootEnglish = false) {
  const clean = baseRoute === '/' ? '/' : `/${baseRoute.replace(/^\/|\/$/g, '')}/`;
  if (locale === 'ml') {
    return clean === '/' ? '/ml/' : `/ml${clean}`;
  }
  if (rootEnglish) {
    return clean;
  }
  return clean === '/' ? '/en/' : `/en${clean}`;
}

const img = (name, alt, extra = '') => `<img src="/assets/img/${name}.jpg" alt="${esc(alt)}" width="572" height="320" loading="lazy" decoding="async" ${extra}>`;

function waBtn(type, label, cls = '', locale = 'en', extraParam = '') {
  const url = buildWhatsAppUrl(type, locale, extraParam);
  const isConfigured = isWhatsAppConfigured();
  const targetAttr = isConfigured ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="btn ${cls}" href="${url}"${targetAttr} data-wa-action="${type}" data-wa-locale="${locale}" data-wa-param="${esc(extraParam)}">${label}</a>`;
}

function waChoice(type, title, desc, cta, locale = 'en') {
  const url = buildWhatsAppUrl(type, locale);
  const isConfigured = isWhatsAppConfigured();
  const targetAttr = isConfigured ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="choice" href="${url}"${targetAttr} data-wa-action="${type}" data-wa-locale="${locale}"><div><h3>${title}</h3><p>${desc}</p></div><span class="arrow" aria-hidden="true">${cta}</span></a>`;
}

const section = (cls, inner, wrapCls = '') => `<section class="section ${cls}"><div class="wrap ${wrapCls}">${inner}</div></section>`;
const head = (h, p = '', right = '') => `<div class="sec-head"><div><h2>${h}</h2>${p ? `<p>${p}</p>` : ''}</div>${right}</div>`;

function renderSvcCard(s, locale, rootEnglish, hi = false, featured = false, searchable = false) {
  const href = routeFor(`/services/${s.slug}/`, locale, rootEnglish);
  const cardTitle = esc(locale === 'ml' && s.displayName ? s.displayName : s.name);
  const searchAttr = searchable ? ` data-service-card data-search="${esc(`${s.name} ${s.displayName || ''} ${s.short} ${s.searchTerms || ''}`)}"` : '';
  const photoAlt = s.photoAlt || `${s.name} professional at work`;
  const viewDetailsLabel = locale === 'ml' ? 'വിവരങ്ങൾ അറിയാം →' : 'View details →';

  return `<a class="card${featured ? ' popular-card' : ''}"${searchAttr} href="${href}"><div class="ph">${hi ? img(s.img, photoAlt, 'fetchpriority="high"').replace('loading="lazy"', '') : img(s.img, photoAlt)}</div><div class="cb"><h3>${cardTitle}</h3><p>${esc(s.short)}</p><span class="go">${viewDetailsLabel}</span></div></a>`;
}

function faqAcc(items, pre) {
  return items.map((it, i) => `<div class="acc"><h3><button class="acc-btn" id="${pre}-b${i}" aria-expanded="false" aria-controls="${pre}-p${i}">${esc(it[0])}</button></h3><div class="acc-p" id="${pre}-p${i}" role="region" aria-labelledby="${pre}-b${i}" hidden><p>${esc(it[1])}</p></div></div>`).join('');
}

function renderCta(title, text, primary, secondary = '') {
  return section('tight', `<div class="cta"><div><h2>${title}</h2><p>${text}</p></div><div class="btn-row">${primary}${secondary}</div></div>`);
}

function renderLanguageSwitcher(baseRoute, locale, rootEnglish) {
  return '';
}

/* ---------- Master Layout ---------- */
function layout({ baseRoute, locale, rootEnglish, title, desc, body, c }) {
  const isMl = locale === 'ml';
  const brandHref = routeFor('/', locale, rootEnglish);

  const navItems = [
    [routeFor('/', locale, rootEnglish), c.common.nav.home, baseRoute === '/'],
    [routeFor('/about/', locale, rootEnglish), c.common.nav.about, baseRoute === '/about/'],
    [routeFor('/services/', locale, rootEnglish), c.common.nav.services, baseRoute.startsWith('/services')],
    [routeFor('/join/', locale, rootEnglish), c.common.nav.forProfessionals, baseRoute === '/join/'],
    [routeFor('/faq/', locale, rootEnglish), c.common.nav.faq, baseRoute === '/faq/'],
    [routeFor('/contact/', locale, rootEnglish), c.common.nav.contact, baseRoute === '/contact/']
  ];

  const navHtml = navItems.map(([href, label, active]) => `<a class="nl" href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`).join('');

  const currentLang = isMl ? 'മല' : 'EN';
  const targetLang = isMl ? 'EN' : 'മല';
  const targetUrl = isMl ? routeFor(baseRoute, 'en', true) : routeFor(baseRoute, 'ml', false);
  const targetAria = isMl ? 'Switch to English' : 'മലയാളം പതിപ്പിലേക്ക് മാറ്റുക';
  const targetLangAttr = isMl ? ' lang="en"' : ' lang="ml"';
  const langLinkHtml = !ENGLISH_ONLY ? `<div class="lang-switcher"><a class="nl lang-toggle" href="${targetUrl}" aria-label="${targetAria}"><span class="lang-current">${currentLang}</span><svg class="lang-arrow" viewBox="0 0 10 6" width="9" height="6" aria-hidden="true" focusable="false"><path d="M1 1.25L5 5.25L9 1.25" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></a><div class="lang-menu"><a class="lang-menu-item" href="${targetUrl}"${targetLangAttr} aria-label="${targetAria}">${targetLang}</a></div></div>` : '';

  const currentPath = locale === 'ml' ? routeFor(baseRoute, 'ml') : (rootEnglish ? routeFor(baseRoute, 'en', true) : routeFor(baseRoute, 'en', false));
  const enCanon = routeFor(baseRoute, 'en', false);
  const mlCanon = routeFor(baseRoute, 'ml', false);

  const canon = SITE_URL ? `<link rel="canonical" href="${SITE_URL.replace(/\/$/, '')}${currentPath}">` : `<link rel="canonical" href="${currentPath}">`;
  const alternates = !ENGLISH_ONLY ? `<link rel="alternate" hreflang="en" href="${enCanon}"><link rel="alternate" hreflang="ml" href="${mlCanon}"><link rel="alternate" hreflang="x-default" href="${enCanon}">` : '';

  const footerServices = c.categories.slice(0, 4).map(s => {
    const sName = esc(isMl && s.displayName ? s.displayName : s.name);
    return `<a href="${routeFor(`/services/${s.slug}/`, locale, rootEnglish)}">${sName}</a>`;
  }).join('');

  const footerLangHtml = !ENGLISH_ONLY ? `<div class="footer-lang"><span class="f-lang-label">Language:</span> <a href="${routeFor(baseRoute, 'en', true)}" class="${!isMl ? 'active' : ''}">English</a> <span class="sep">·</span> <a href="${routeFor(baseRoute, 'ml', false)}" class="${isMl ? 'active' : ''}" lang="ml">മലയാളം</a></div>` : '';

  return `<!DOCTYPE html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">${canon}${alternates}
<meta property="og:type" content="website"><meta property="og:site_name" content="Taskote"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}">
<meta name="theme-color" content="#5E29FF"><link rel="icon" href="/assets/img/logo.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&family=Noto+Sans+Malayalam:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css"></head>
<body><a class="skip" href="#main">${c.common.skipLink}</a>
<div class="notice" id="whatsapp-notice" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="wa-notice-title" hidden><div class="wrap"><span><b id="wa-notice-title">${c.common.whatsappNotice.title}</b> ${c.common.whatsappNotice.text}</span><button type="button" id="whatsapp-notice-close">${c.common.whatsappNotice.dismiss}</button></div></div>
<header class="site-header"><div class="wrap bar">
<a class="brand" href="${brandHref}" aria-label="Taskote home"><img src="/assets/img/logo.jpg" alt="" width="38" height="38">Taskote</a>
<button class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="site-menu" aria-label="Menu"><span></span></button>
<nav class="nav" id="site-menu" aria-label="Main">${navHtml}${langLinkHtml}<div class="nav-cta"><a class="btn sm" href="${routeFor('/get-started/', locale, rootEnglish)}">${c.common.nav.getStarted}</a></div></nav>
</div></header>
<main id="main">${body}</main>
<footer class="site-footer"><div class="wrap"><div class="fgrid">
<div><a class="brand" href="${brandHref}"><img src="/assets/img/logo.jpg" alt="" width="38" height="38">Taskote</a><p>${c.common.footer.tagline}</p></div>
<div><h4>${c.common.footer.servicesHeading}</h4>${footerServices}<a href="${routeFor('/services/', locale, rootEnglish)}">${c.common.footer.allServices}</a></div>
<div><h4>${c.common.footer.companyHeading}</h4><a href="${routeFor('/about/', locale, rootEnglish)}">${c.common.footer.about}</a><a href="${routeFor('/join/', locale, rootEnglish)}">${c.common.footer.forProfessionals}</a><a href="${routeFor('/get-started/', locale, rootEnglish)}">${c.common.footer.getStarted}</a></div>
<div><h4>${c.common.footer.supportHeading}</h4><a href="${routeFor('/faq/', locale, rootEnglish)}">${c.common.footer.faq}</a><a href="${routeFor('/contact/', locale, rootEnglish)}">${c.common.footer.contact}</a><a href="mailto:${CONTACT.email}" class="footer-email" style="word-break:break-all">${CONTACT.email}</a></div>
</div><div class="fbase"><div>\u00a9 ${new Date().getFullYear()} ${c.common.footer.copyright} \u2014 ${c.common.footer.legalNotice}</div>${footerLangHtml}</div></div></footer>
<script src="/config.js"></script><script src="/site.js" defer></script></body></html>`;
}

/* ---------- Page Generators ---------- */

function buildHomePage(locale, rootEnglish) {
  const c = locale === 'ml' ? mlContent : enContent;
  const isMl = locale === 'ml';
  const bySlug = Object.fromEntries(c.categories.map(s => [s.slug, s]));

  const popularCards = c.home.popular.featuredSlugs.map(slug => {
    return renderSvcCard(bySlug[slug], locale, rootEnglish, false, true);
  }).join('');

  const howItWorksSteps = c.home.howItWorks.steps.map((st, i) => `<li><h3>${esc(st.title)}</h3><p>${esc(st.desc)}</p></li>`).join('');

  const reasonsList = c.home.valueProp.reasons.map(r => `<li><h3>${esc(r.title)}</h3><p>${esc(r.desc)}</p></li>`).join('');

  const clarityChecks = c.home.clarity.checks.map(ck => `<li>${esc(ck)}</li>`).join('');

  const optionsHtml = c.categories.map(s => {
    const sName = esc(isMl && s.displayName ? s.displayName : s.name);
    return `<option value="${s.slug}">${sName}</option>`;
  }).join('');

  const body = `
<section class="hero"><div class="wrap"><div class="hero-copy">
<p class="eyebrow">${esc(c.home.hero.eyebrow)}</p><h1>${esc(c.home.hero.titlePrefix)}<span class="accent">${esc(c.home.hero.titleAccent)}</span></h1>
<p class="lead">${esc(c.home.hero.lead)}</p>
<form class="finder" id="finder"><label class="sr" for="svc">${esc(c.common.serviceFinder.label)}</label><select id="svc" name="service">${optionsHtml}</select><button class="btn" type="submit">${esc(c.common.serviceFinder.button)}</button></form>
<ul class="ticks">${c.home.hero.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
</div>
<div class="mosaic"><figure>${img('electrical', c.home.hero.photoAlts.electrical, 'fetchpriority="high"').replace('loading="lazy"', '')}</figure><figure>${img('cleaning', c.home.hero.photoAlts.cleaning)}</figure><figure>${img('appliance-repair', c.home.hero.photoAlts.appliance)}</figure><aside class="mosaic-note"><strong>${esc(c.home.hero.mosaicNoteTitle)}</strong><span>${esc(c.home.hero.mosaicNoteSubtitle)}</span></aside></div></div></section>

${section('', head(esc(c.home.popular.title), esc(c.home.popular.subtitle), `<a class="link" href="${routeFor('/services/', locale, rootEnglish)}">${esc(c.home.popular.linkText)}</a>`) + `<div class="grid g4 cards-2m popular-grid">${popularCards}</div>`)}

${section('bg-lav', head(esc(c.home.howItWorks.title), esc(c.home.howItWorks.subtitle)) + `<ol class="steps">${howItWorksSteps}</ol>`)}

${section('', `<div class="split top"><div><h2>${esc(c.home.valueProp.title)}</h2><p class="lead" style="margin-top:12px">${esc(c.home.valueProp.lead)}</p></div><ul class="reasons">${reasonsList}</ul></div>`)}

${section('bg-lav', `<div class="split"><div class="photo tall"><img src="/assets/img/pest-control.jpg" alt="${esc(c.home.clarity.photoAlt)}" width="572" height="320" loading="lazy"></div><div><h2>${esc(c.home.clarity.title)}</h2><p class="lead" style="margin:12px 0 var(--s3)">${esc(c.home.clarity.lead)}</p><ul class="checks">${clarityChecks}</ul></div></div>`)}

${section('', `<div class="pro-banner"><div class="pro-banner-copy"><p class="eyebrow">${esc(c.home.proBanner.eyebrow)}</p><h2>${esc(c.home.proBanner.title)}</h2><p>${esc(c.home.proBanner.desc)}</p><div class="btn-row">${waBtn('professional', esc(c.home.proBanner.ctaPrimary), 'light', locale)}<a class="btn ghost-light" href="${routeFor('/faq/#professionals', locale, rootEnglish)}">${esc(c.home.proBanner.ctaSecondary)}</a></div></div><figure class="pro-banner-photo"><img src="/assets/img/professional.jpg" alt="${esc(c.home.proBanner.photoAlt)}" width="838" height="470" loading="lazy"></figure></div>`)}

${renderCta(esc(c.home.bottomCta.title), esc(c.home.bottomCta.text), waBtn('customer', esc(c.home.bottomCta.primaryBtn), 'light', locale), `<a class="btn ghost-light" href="${routeFor('/services/', locale, rootEnglish)}">${esc(c.home.bottomCta.secondaryBtn)}</a>`)}
`;

  return layout({
    baseRoute: '/',
    locale,
    rootEnglish,
    title: c.home.meta.title,
    desc: c.home.meta.description,
    body,
    c
  });
}

function buildAboutPage(locale, rootEnglish) {
  const c = locale === 'ml' ? mlContent : enContent;

  const valuesHtml = c.about.values.items.map(v => `<div class="card"><div class="cb"><h3>${esc(v.title)}</h3><p>${esc(v.desc)}</p></div></div>`).join('');
  const customerChecks = c.about.howItHelps.customers.items.map(item => `<li>${esc(item)}</li>`).join('');
  const proChecks = c.about.howItHelps.professionals.items.map(item => `<li>${esc(item)}</li>`).join('');

  const body = `<section class="phero about-hero"><div class="wrap"><div><p class="eyebrow">${esc(c.about.hero.eyebrow)}</p><h1>${esc(c.about.hero.title)}</h1><p class="lead">${esc(c.about.hero.lead)}</p><div class="btn-row"><a class="btn" href="${routeFor('/services/', locale, rootEnglish)}">${esc(c.about.hero.ctaPrimary)}</a><a class="btn outline" href="${routeFor('/join/', locale, rootEnglish)}">${esc(c.about.hero.ctaSecondary)}</a></div></div><figure class="about-portrait"><img src="/assets/img/professional.jpg" alt="${esc(c.about.hero.photoAlt)}" width="838" height="470" loading="eager" decoding="async"><figcaption>${esc(c.about.hero.caption)}</figcaption></figure></div></section>

${section('', `<div class="split top"><div><h2>${esc(c.about.missionVision.mission.title)}</h2><p class="lead" style="margin-top:12px">${esc(c.about.missionVision.mission.lead)}</p></div><div><h2>${esc(c.about.missionVision.vision.title)}</h2><p class="lead" style="margin-top:12px">${esc(c.about.missionVision.vision.lead)}</p></div></div>`)}

${section('bg-lav', head(esc(c.about.values.title)) + `<div class="grid g4">${valuesHtml}</div>`)}

${section('', `<div class="split top"><div><h2>${esc(c.about.howItHelps.customers.title)}</h2><ul class="checks" style="margin-top:var(--s2)">${customerChecks}</ul></div><div><h2>${esc(c.about.howItHelps.professionals.title)}</h2><ul class="checks" style="margin-top:var(--s2)">${proChecks}</ul></div></div>`)}

${renderCta(esc(c.about.bottomCta.title), esc(c.about.bottomCta.text), waBtn('customer', esc(c.about.bottomCta.primaryBtn), 'light', locale), `<a class="btn ghost-light" href="${routeFor('/join/', locale, rootEnglish)}">${esc(c.about.bottomCta.secondaryBtn)}</a>`)}
`;

  return layout({
    baseRoute: '/about/',
    locale,
    rootEnglish,
    title: c.about.meta.title,
    desc: c.about.meta.description,
    body,
    c
  });
}

function buildServicesDirectoryPage(locale, rootEnglish) {
  const c = locale === 'ml' ? mlContent : enContent;
  const cardsHtml = c.categories.map(s => renderSvcCard(s, locale, rootEnglish, false, false, true)).join('');

  const body = `<section class="phero services-hero"><div class="wrap"><div class="services-hero-copy"><p class="eyebrow">${esc(c.services.hero.eyebrow)}</p><h1>${esc(c.services.hero.title)}</h1><p class="lead">${esc(c.services.hero.lead)}</p></div><div class="photo services-hero-photo"><img src="/assets/img/electrical.jpg" alt="${esc(c.services.hero.photoAlt)}" width="572" height="320" fetchpriority="high" decoding="async"></div></div></section>

${section('', `<div class="service-directory"><form class="finder service-finder" id="service-filter" role="search"><label class="sr" for="service-query">${esc(c.common.serviceFilter.label)}</label><div class="service-search-field"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 4.5 4.5"></path></svg><input id="service-query" name="q" type="search" autocomplete="off" aria-controls="service-directory-grid" aria-describedby="service-filter-status" placeholder="${esc(c.common.serviceFilter.placeholder)}"></div><button class="btn" type="submit">${esc(c.common.serviceFilter.button)}</button></form><p class="service-filter-status" id="service-filter-status" aria-live="polite">${esc(c.common.serviceFilter.statusAll)}</p><div class="grid g4 cards-2m" id="service-directory-grid">${cardsHtml}</div><p class="service-empty" id="service-empty" hidden>${esc(c.common.serviceFilter.statusNone)}</p></div>`)}

${renderCta(esc(c.services.bottomCta.title), esc(c.services.bottomCta.text), waBtn('customer', esc(c.services.bottomCta.primaryBtn), 'light', locale), `<a class="btn ghost-light" href="${routeFor('/join/', locale, rootEnglish)}">${esc(c.services.bottomCta.secondaryBtn)}</a>`)}
`;

  return layout({
    baseRoute: '/services/',
    locale,
    rootEnglish,
    title: c.services.meta.title,
    desc: c.services.meta.description,
    body,
    c
  });
}

function buildCategoryPage(s, index, locale, rootEnglish) {
  const c = locale === 'ml' ? mlContent : enContent;
  const isMl = locale === 'ml';
  const categoryTitle = esc(isMl && s.displayName ? s.displayName : s.name);
  const others = c.categories.filter(o => o.slug !== s.slug);
  const rel = others.slice(index % 5, (index % 5) + 3);
  const relCards = (rel.length === 3 ? rel : others.slice(0, 3)).map(o => renderSvcCard(o, locale, rootEnglish)).join('');
  const flip = index % 2 === 1;

  const coversList = s.covers.map(item => `<li>${esc(item)}</li>`).join('');
  const factsList = s.facts.map(item => `<li>${esc(item)}</li>`).join('');
  const prepList = s.prep.map(item => `<li>${esc(item)}</li>`).join('');

  const body = `<section class="phero"><div class="wrap"><div><div class="crumbs"><a href="${routeFor('/', locale, rootEnglish)}">${esc(c.common.breadcrumbs.home)}</a><span>/</span><a href="${routeFor('/services/', locale, rootEnglish)}">${esc(c.common.breadcrumbs.services)}</a><span>/</span>${categoryTitle}</div><h1>${categoryTitle}</h1><p class="lead">${esc(s.intro)}</p><div class="btn-row">${waBtn('service', esc(c.common.buttons.enquireWhatsApp), '', locale, s.name)}<a class="btn outline" href="${routeFor('/services/', locale, rootEnglish)}">${esc(c.common.buttons.allServices)}</a></div></div><div class="photo">${img(s.img, s.photoAlt || `${s.name} professional at work`, 'fetchpriority="high"').replace('loading="lazy"', '')}</div></div></section>

${section('', `<div class="split top" ${flip ? 'style="direction:rtl"' : ''}><div style="direction:ltr"><h2>${esc(s.coversTitle)}</h2><ul class="checks" style="margin-top:var(--s2)">${coversList}</ul></div><div style="direction:ltr"><div class="aside"><h3>${esc(s.factsTitle)}</h3><ul class="checks">${factsList}</ul></div></div></div>`)}

${section('bg-lav', `<div class="split top"><div><h2>${esc(s.prepTitle)}</h2><p class="lead" style="margin-top:12px">${esc(s.prepSubtitle || '')}</p></div><ul class="checks">${prepList}</ul></div>`)}

${section('', head(esc(s.otherServicesTitle || 'Other services')) + `<div class="grid g3 cards-2m">${relCards}</div>`)}

${renderCta(esc(s.bottomCta.title), esc(s.bottomCta.text), waBtn('service', esc(s.bottomCta.primaryBtn), 'light', locale, s.name), `<a class="btn ghost-light" href="${routeFor('/services/', locale, rootEnglish)}">${esc(s.bottomCta.secondaryBtn)}</a>`)}
`;

  return layout({
    baseRoute: `/services/${s.slug}/`,
    locale,
    rootEnglish,
    title: `${categoryTitle} | Taskote`,
    desc: s.intro,
    body,
    c
  });
}

function buildFaqPage(locale, rootEnglish) {
  const c = locale === 'ml' ? mlContent : enContent;

  const tabListHtml = c.faq.categories.map((cat, i) => `<button class="tab" role="tab" id="tab-${cat.key}" data-key="${cat.key}" aria-controls="panel-${cat.key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(cat.title)}</button>`).join('');

  const panelsHtml = c.faq.categories.map((cat, i) => `<div role="tabpanel" id="panel-${cat.key}" aria-labelledby="tab-${cat.key}" ${i ? 'hidden' : ''}><h2 style="font-size:26px;margin-bottom:var(--s3)">${esc(cat.title)}</h2>${faqAcc(cat.items, cat.key)}</div>`).join('');

  const body = `<section class="phero plain"><div class="wrap"><h1>${esc(c.faq.hero.title)}</h1><p class="lead">${esc(c.faq.hero.lead)}</p></div></section>

${section('', `<div class="faq"><div class="tablist" role="tablist" aria-label="FAQ categories" aria-orientation="vertical">${tabListHtml}</div><div>${panelsHtml}</div></div>`)}

${renderCta(esc(c.faq.bottomCta.title), esc(c.faq.bottomCta.text), `<a class="btn light" href="${routeFor('/contact/', locale, rootEnglish)}">${esc(c.faq.bottomCta.buttonText)}</a>`)}
`;

  return layout({
    baseRoute: '/faq/',
    locale,
    rootEnglish,
    title: c.faq.meta.title,
    desc: c.faq.meta.description,
    body,
    c
  });
}

function buildContactPage(locale, rootEnglish) {
  const c = locale === 'ml' ? mlContent : enContent;
  const ci = (ic, t, v, ph) => `<li><span class="ico" aria-hidden="true">${ic}</span><div><b>${t}${ph ? `<span class="ph-tag">${esc(c.contact.info.placeholderTag)}</span>` : ''}</b>${v}</div></li>`;

  const topicsOptions = c.contact.form.topics.map(tp => `<option>${esc(tp)}</option>`).join('');

  const body = `<section class="phero plain"><div class="wrap"><h1>${esc(c.contact.hero.title)}</h1><p class="lead">${esc(c.contact.hero.lead)}</p></div></section>

${section('', `<div class="split top contact-layout"><div class="contact-copy"><div class="photo support-photo"><img src="/assets/img/support-agent.jpg" alt="${esc(c.contact.info.photoAlt)}" width="560" height="340" loading="lazy" decoding="async"></div><ul class="contact-list">${ci('WA', esc(c.contact.info.whatsAppLabel), `<div style="margin-top:6px">${waBtn('contact', esc(c.contact.info.whatsAppAction), 'sm', locale)}</div>`, 0)}${ci('@', esc(c.contact.info.emailLabel), `<a href="mailto:${CONTACT.email}">${CONTACT.email}</a><br><span style="color:var(--muted);font-size:13px">${esc(c.contact.info.emailNotice)}</span>`, 0)}${ci('\u260E', esc(c.contact.info.phoneLabel), `${CONTACT.phone}<br><span style="color:var(--muted);font-size:14px">${esc(c.contact.info.hoursLabel)}</span>`, 0)}${ci('\u2302', esc(c.contact.info.locationLabel), esc(c.contact.info.locationValue), 0)}</ul><p style="color:var(--muted);font-size:14px;margin-top:var(--s2)">${esc(c.contact.info.placeholderNotice)}</p></div>
<form class="form contact-form" id="contact-form" novalidate><h2 style="font-size:26px">${esc(c.contact.form.title)}</h2><p class="form-note">${esc(c.contact.form.note)}</p><label for="n">${esc(c.contact.form.nameLabel)}</label><input id="n" name="name" autocomplete="name" required><label for="e">${esc(c.contact.form.emailLabel)}</label><input id="e" name="email" type="email" autocomplete="email" required><label for="t">${esc(c.contact.form.topicLabel)}</label><select id="t" name="topic">${topicsOptions}</select><label for="m">${esc(c.contact.form.messageLabel)}</label><textarea id="m" name="message" required></textarea><p class="status" id="form-status" role="status"></p><button class="btn" type="submit" style="margin-top:var(--s2);width:100%">${esc(c.contact.form.submitBtn)}</button></form></div>`)}
`;

  return layout({
    baseRoute: '/contact/',
    locale,
    rootEnglish,
    title: c.contact.meta.title,
    desc: c.contact.meta.description,
    body,
    c
  });
}

function buildSignInPage(locale, rootEnglish) {
  const c = locale === 'ml' ? mlContent : enContent;
  const p = c.auth.signIn;

  const body = `<section class="phero plain auth-hero"><div class="wrap"><div class="auth-layout"><div class="auth-visual"><img src="/assets/img/professional.jpg" alt="${esc(p.photoAlt)}" width="838" height="470"><div class="auth-caption"><span>${esc(p.visualCaption.welcome)}</span><strong>${esc(p.visualCaption.sub)}</strong></div></div><div class="gate"><div class="form"><p class="eyebrow">${esc(p.eyebrow)}</p><h1 style="font-size:34px">${esc(p.title)}</h1><p class="lead" style="margin:12px 0 var(--s3)">${esc(p.lead)}</p><div style="display:grid;margin-bottom:var(--s2)">${waBtn('general', esc(p.button), '', locale)}</div><p style="margin:var(--s3) 0 0;color:var(--muted);font-size:15px">${esc(p.exploreServicesText)} <a href="${routeFor('/services/', locale, rootEnglish)}">${esc(p.exploreServicesLink)}</a></p></div></div></div></div></section>`;

  return layout({
    baseRoute: '/sign-in/',
    locale,
    rootEnglish,
    title: p.meta.title,
    desc: p.meta.description,
    body,
    c
  });
}

function buildGetStartedPage(locale, rootEnglish) {
  const c = locale === 'ml' ? mlContent : enContent;
  const p = c.auth.getStarted;

  const body = `<section class="phero plain auth-hero"><div class="wrap"><div class="auth-layout"><div class="auth-visual"><img src="/assets/img/appliance-repair.jpg" alt="${esc(p.photoAlt)}" width="572" height="320"><div class="auth-caption"><span>${esc(p.visualCaption.title)}</span><strong>${esc(p.visualCaption.sub)}</strong></div></div><div class="gate"><div class="form"><p class="eyebrow">${esc(p.eyebrow)}</p><h1 style="font-size:34px">${esc(p.title)}</h1><p class="lead" style="margin:12px 0 var(--s3)">${esc(p.lead)}</p>
${waChoice('getStartedCustomer', esc(p.customerChoice.title), esc(p.customerChoice.desc), esc(p.customerChoice.cta), locale)}
${waChoice('getStartedPro', esc(p.proChoice.title), esc(p.proChoice.desc), esc(p.proChoice.cta), locale)}
<p style="margin:var(--s3) 0 0;color:var(--muted);font-size:14px;text-align:center">${esc(p.note)}</p></div></div></div></div></section>`;

  return layout({
    baseRoute: '/get-started/',
    locale,
    rootEnglish,
    title: p.meta.title,
    desc: p.meta.description,
    body,
    c
  });
}

function buildJoinPage(locale, rootEnglish) {
  const c = locale === 'ml' ? mlContent : enContent;
  const isMl = locale === 'ml';

  const tradesGrid = c.categories.map(s => {
    const sName = esc(isMl && s.displayName ? s.displayName : s.name);
    return `<div class="card"><div class="cb"><h3>${sName}</h3></div></div>`;
  }).join('');

  const expectPoints = c.join.expect.points.map(pt => `<li>${esc(pt)}</li>`).join('');

  const body = `<section class="phero"><div class="wrap"><div><h1>${esc(c.join.hero.title)}</h1><p class="lead">${esc(c.join.hero.lead)}</p><div class="btn-row">${waBtn('professional', esc(c.join.hero.primaryBtn), '', locale)}<a class="btn outline" href="${routeFor('/faq/', locale, rootEnglish)}">${esc(c.join.hero.secondaryBtn)}</a></div></div><div class="photo">${img('professional', c.join.hero.photoAlt).replace('width="572" height="320"', 'width="838" height="470"')}</div></div></section>

${section('', head(esc(c.join.trades.title)) + `<div class="grid g4 cards-2m">${tradesGrid}</div>`)}

${section('bg-lav', `<div class="split top"><div><h2>${esc(c.join.expect.title)}</h2><p class="lead" style="margin-top:12px">${esc(c.join.expect.lead)}</p></div><ul class="checks">${expectPoints}</ul></div>`)}

${renderCta(esc(c.join.bottomCta.title), esc(c.join.bottomCta.text), waBtn('professional', esc(c.join.bottomCta.primaryBtn), 'light', locale))}
`;

  return layout({
    baseRoute: '/join/',
    locale,
    rootEnglish,
    title: c.join.meta.title,
    desc: c.join.meta.description,
    body,
    c
  });
}

function buildNotFoundPage() {
  const c = enContent;
  return layout({
    baseRoute: '/',
    locale: 'en',
    rootEnglish: true,
    title: 'Page not found | Taskote',
    desc: 'The requested page could not be found.',
    body: `<section class="phero plain"><div class="wrap"><h1>Page not found</h1><p class="lead">That page does not exist.</p><div class="btn-row"><a class="btn" href="/">Go home</a><a class="btn outline" href="/services/">Browse services</a></div></div></section>`,
    c
  });
}

/* ---------- Build Process ---------- */
fs.rmSync(OUT, { recursive: true, force: true });

function writePage(diskPath, html) {
  const fullDir = path.join(OUT, diskPath);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(path.join(fullDir, 'index.html'), html);
}

// 1. Build English Root pages (served at /, /about/, etc.)
writePage('/', buildHomePage('en', true));
writePage('/about', buildAboutPage('en', true));
writePage('/services', buildServicesDirectoryPage('en', true));
enContent.categories.forEach((s, idx) => {
  writePage(`/services/${s.slug}`, buildCategoryPage(s, idx, 'en', true));
});
writePage('/faq', buildFaqPage('en', true));
writePage('/contact', buildContactPage('en', true));
writePage('/sign-in', buildSignInPage('en', true));
writePage('/get-started', buildGetStartedPage('en', true));
writePage('/join', buildJoinPage('en', true));

if (!ENGLISH_ONLY) {
  // 2. Build English canonical pages under /en/
  writePage('/en/', buildHomePage('en', false));
  writePage('/en/about', buildAboutPage('en', false));
  writePage('/en/services', buildServicesDirectoryPage('en', false));
  enContent.categories.forEach((s, idx) => {
    writePage(`/en/services/${s.slug}`, buildCategoryPage(s, idx, 'en', false));
  });
  writePage('/en/faq', buildFaqPage('en', false));
  writePage('/en/contact', buildContactPage('en', false));
  writePage('/en/sign-in', buildSignInPage('en', false));
  writePage('/en/get-started', buildGetStartedPage('en', false));
  writePage('/en/join', buildJoinPage('en', false));

  // 3. Build Native Malayalam pages under /ml/
  writePage('/ml/', buildHomePage('ml', false));
  writePage('/ml/about', buildAboutPage('ml', false));
  writePage('/ml/services', buildServicesDirectoryPage('ml', false));
  mlContent.categories.forEach((s, idx) => {
    writePage(`/ml/services/${s.slug}`, buildCategoryPage(s, idx, 'ml', false));
  });
  writePage('/ml/faq', buildFaqPage('ml', false));
  writePage('/ml/contact', buildContactPage('ml', false));
  writePage('/ml/sign-in', buildSignInPage('ml', false));
  writePage('/ml/get-started', buildGetStartedPage('ml', false));
  writePage('/ml/join', buildJoinPage('ml', false));
}

// 4. Static assets & auxiliary files
fs.writeFileSync(path.join(OUT, '404.html'), buildNotFoundPage());
fs.copyFileSync(path.join(ROOT_DIR, 'src', 'styles.css'), path.join(OUT, 'styles.css'));
fs.copyFileSync(path.join(ROOT_DIR, 'src', 'site.js'), path.join(OUT, 'site.js'));
fs.cpSync(path.join(ROOT_DIR, 'assets'), path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'config.js'), `window.JOBCO_CONFIG=${JSON.stringify({ WHATSAPP_NUMBER: WHATSAPP_CONFIG.phoneNumber, CONTACT_EMAIL: CONTACT.email, CONTACT_ENDPOINT })};`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n');

const totalPages = ENGLISH_ONLY ? 16 : 48; // 16 root-EN + 16 /en/ + 16 /ml/
console.log(`Successfully built ${totalPages} pages (${ENGLISH_ONLY ? 'English only' : 'English & Malayalam'}). WhatsApp status: ${isWhatsAppConfigured() ? 'configured' : 'placeholder/unconfigured'}`);
