/* ═══ AHURIVAN — Main Script ═══ */

const htmlEl = document.documentElement;

// 1. Theme
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
function setTheme(theme) {
  if (theme === 'dark') { htmlEl.setAttribute('data-theme', 'dark'); themeIcon.textContent = '☀'; }
  else { htmlEl.removeAttribute('data-theme'); themeIcon.textContent = '☾'; }
  localStorage.setItem('ahurivan-theme', theme);
}
const savedTheme = localStorage.getItem('ahurivan-theme');
if (savedTheme) setTheme(savedTheme); else setTheme((new Date().getHours() >= 20 || new Date().getHours() < 6) ? 'dark' : 'light');
themeToggle.addEventListener('click', () => setTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

// 2. Hell Mode
const hellBtn = document.getElementById('hell-mode-btn');
if (hellBtn) {
  hellBtn.addEventListener('click', () => htmlEl.classList.toggle('hell-mode'));
  hellBtn.addEventListener('mouseenter', () => hellBtn.style.opacity = '1');
  hellBtn.addEventListener('mouseleave', () => hellBtn.style.opacity = '0.3');
}
// ═══ شورت‌کات Shift + H برای Hell Mode ═══
document.addEventListener('keydown', (e) => {
  // چک می‌کنیم که آیا کاربر توی یه فیلد متنی تایپ می‌کنه یا نه
  const activeElement = document.activeElement;
  const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

  // اگه داشت تایپ می‌کرد، شورت‌کات اجرا نشه که مزاحمش بشه
  if (isTyping) return;

  // به جای e.key از e.code استفاده می‌کنیم که به زبان کیبورد حساس نباشه
  // KeyH یعنی همون دکمه H انگلیسی روی کیبورد
  if (e.shiftKey && e.code === 'KeyH') {
    e.preventDefault();
    htmlEl.classList.toggle('hell-mode');
    
    // یه افکت صوتی یا پیام برای فیدبک بهتر (اختیاری)
    if (htmlEl.classList.contains('hell-mode')) {
      showToast('🔥 Hell Mode Activated');
    } else {
      showToast('☀️ Hell Mode Deactivated');
    }
  }
});

// 3. Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = -100, mouseY = -100, outlineX = -100, outlineY = -100;
if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorOutline) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    cursorDot.classList.remove('cursor-hidden'); cursorOutline.classList.remove('cursor-hidden');
  });
  window.addEventListener('mouseout', () => { cursorDot.classList.add('cursor-hidden'); cursorOutline.classList.add('cursor-hidden'); });
  function animateCursor() { outlineX += (mouseX - outlineX) * 0.15; outlineY += (mouseY - outlineY) * 0.15; cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`; requestAnimationFrame(animateCursor); }
  animateCursor();
  document.querySelectorAll('a, button, input, textarea, .skill-card, .portfolio-item, .blog-card, .faq-question').forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
  });
}

// 4. Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => { navLinks.classList.toggle('open'); hamburger.classList.toggle('open'); });
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { navLinks.classList.remove('open'); hamburger.classList.remove('open'); }));

// 5. Reveal & Stats
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      const bar = entry.target.querySelector('.skill-progress');
      if (bar) bar.style.width = bar.dataset.progress + '%';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.section, .skill-card, .portfolio-item, .blog-card, .stat, .achievement-card, .faq-item, .repo-card, .timeline-node').forEach(el => {
  el.classList.add('reveal'); revealObserver.observe(el);
});
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = +entry.target.dataset.count;
    const start = performance.now(); const duration = 1200;
    const animate = (now) => { const p = Math.min((now - start) / duration, 1); entry.target.textContent = Math.floor(p * target); if (p < 1) requestAnimationFrame(animate); else entry.target.textContent = target; };
    requestAnimationFrame(animate); statObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// 6. Tilt
const tiltCards = document.querySelectorAll('.skill-card, .portfolio-item, .blog-card, .achievement-card, .repo-card');
if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
  tiltCards.forEach(card => {
    card.classList.add('card-3d');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8;
      const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`);
  });
}

// 7. Particles
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [], particleMouseX = -1000, particleMouseY = -1000;
window.addEventListener('mousemove', (e) => { particleMouseX = e.clientX; particleMouseY = e.clientY; });
function getParticleColor() { return htmlEl.getAttribute('data-theme') === 'dark' ? '217,43,43' : '201,162,39'; }
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas(); window.addEventListener('resize', resizeCanvas);
const COUNT = window.innerWidth < 768 ? 18 : 35;
for (let i = 0; i < COUNT; i++) { particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 1.5 + 0.3, speedX: (Math.random() - 0.5) * 0.2, speedY: (Math.random() - 0.5) * 0.2, opacity: Math.random() * 0.4 + 0.1 }); }
let lastTime = 0;
function animateParticles(now) {
  requestAnimationFrame(animateParticles);
  if (now - lastTime < 33) return; lastTime = now;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const color = getParticleColor();
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const dx = p.x - particleMouseX, dy = p.y - particleMouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 120) { const force = (120 - distance) / 120; p.x += (dx / distance) * force * 3; p.y += (dy / distance) * force * 3; }
    p.x += p.speedX; p.y += p.speedY;
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${color}, ${p.opacity})`; ctx.fill();
  }
}
requestAnimationFrame(animateParticles);

// 8. Contact Form (Honeypot)
const form = document.getElementById('contactForm');
const status = document.querySelector('.form-status');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value !== '') { status.textContent = '✗ خطا! درخواست شما به عنوان اسپم شناسایی شد.'; return; }

    const action = form.getAttribute('action');
    if (action.includes('YOUR_FORM_ID')) {
      status.textContent = '⏳ (دمو) در حال ارسال...';
      setTimeout(() => { status.textContent = '✓ (دمو) پیام دریافت شد.'; form.reset(); showToast('پیامت رسید ✓'); }, 800);
      return;
    }
    status.textContent = '⏳ در حال ارسال...';
    try { 
      const res = await fetch(action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } }); 
      if (res.ok) { status.textContent = '✓ پیامت رسید.'; form.reset(); showToast('پیامت با موفقیت ارسال شد ✓'); } 
      else { status.textContent = '✗ خطا در ارسال.'; showToast('خطا ✗'); } 
    } catch { status.textContent = '✗ خطای شبکه.'; showToast('خطا ✗'); }
  });
}

// 9. Slider, FAQ, Newsletter, Back-to-top
const backToTop = document.querySelector('.back-to-top');
const navbar = document.querySelector('.navbar');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => { backToTop.classList.toggle('visible', window.scrollY > 600); navbar.classList.toggle('scrolled', window.scrollY > 50); ticking = false; });
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const testimonialCards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('sliderDots');
let currentTestimonial = 0;
if (testimonialCards.length > 0) {
  testimonialCards.forEach((_, i) => { const dot = document.createElement('button'); dot.className = 'slider-dot' + (i === 0 ? ' active' : ''); dot.addEventListener('click', () => goToTestimonial(i)); dotsContainer.appendChild(dot); });
  testimonialCards[0].classList.add('active');
  function goToTestimonial(index) { testimonialCards.forEach(c => c.classList.remove('active')); dotsContainer.querySelectorAll('.slider-dot').forEach(d => d.classList.remove('active')); currentTestimonial = index; testimonialCards[index].classList.add('active'); dotsContainer.children[index].classList.add('active'); }
  document.getElementById('nextTestimonial').addEventListener('click', () => goToTestimonial((currentTestimonial + 1) % testimonialCards.length));
  document.getElementById('prevTestimonial').addEventListener('click', () => goToTestimonial((currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length));
  setInterval(() => goToTestimonial((currentTestimonial + 1) % testimonialCards.length), 6000);
}

document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => { const isOpen = item.classList.contains('open'); document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open')); if (!isOpen) item.classList.add('open'); });
});

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault(); const newsletterStatus = document.getElementById('newsletterStatus'); newsletterStatus.textContent = '⏳ در حال ثبت...';
    setTimeout(() => { newsletterStatus.textContent = '✓ عضویتت ثبت شد!'; newsletterForm.reset(); showToast('عضویت ثبت شد ✓'); }, 800);
  });
}

const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000); }

// 10. Search, Chatbot, Easter Egg
const searchBtn = document.getElementById('search-btn'); const searchModal = document.getElementById('search-modal'); const searchInput = document.getElementById('search-input'); const searchResults = document.getElementById('search-results'); const searchClose = document.getElementById('search-close');
const articleIndex = [ { title: 'چگونه با کد، واقعیت را تغییر دهیم', url: 'article-1.html', tags: 'کد برنامه‌نویسی', desc: 'نگاهی فلسفی' }, { title: 'هوش مصنوعی و مرزهای اخلاق', url: 'article-2.html', tags: 'هوش مصنوعی اخلاق', desc: 'چالش‌های اخلاقی' }, { title: 'معماری سیستم‌های فناناپذیر', url: 'article-3.html', tags: 'معماری سیستم', desc: 'سیستم‌های مقاوم' } ];
function openSearch() { searchModal.classList.add('open'); setTimeout(() => searchInput.focus(), 100); } function closeSearch() { searchModal.classList.remove('open'); searchInput.value = ''; searchResults.innerHTML = ''; }
if(searchBtn) searchBtn.addEventListener('click', openSearch); if(searchClose) searchClose.addEventListener('click', closeSearch);
if(searchModal) {
  searchModal.addEventListener('click', (e) => { if (e.target === searchModal) closeSearch(); });
  document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); } if (e.key === 'Escape') closeSearch(); });
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase(); searchResults.innerHTML = ''; if (!query) return;
    const matches = articleIndex.filter(a => a.title.toLowerCase().includes(query) || a.tags.toLowerCase().includes(query) || a.desc.toLowerCase().includes(query));
    if (matches.length === 0) { searchResults.innerHTML = '<div class="search-empty">نتیجه‌ای یافت نشد 𖤍</div>'; return; }
    matches.forEach(m => { const item = document.createElement('a'); item.href = m.url; item.className = 'search-result-item'; item.innerHTML = `<h4>${m.title}</h4><p>${m.desc}</p>`; searchResults.appendChild(item); });
  });
}

const chatbotToggle = document.getElementById('chatbotToggle'); const chatbotWindow = document.getElementById('chatbotWindow'); const chatbotClose = document.getElementById('chatbotClose'); const chatbotMessages = document.getElementById('chatbotMessages'); const chatbotForm = document.getElementById('chatbotForm'); const chatbotInput = document.getElementById('chatbotInput'); const quickReplies = document.getElementById('chatbotQuickReplies');
if (chatbotToggle) {
  chatbotToggle.addEventListener('click', () => chatbotWindow.classList.toggle('open')); chatbotClose.addEventListener('click', () => chatbotWindow.classList.remove('open'));
  const botResponses = { 'خدمات': 'ما در زمینه‌های زیر کار می‌کنیم:\n⚔ توسعه وب\n🐍 پایتون\n🎨 طراحی Adobe\n🜏 هوش مصنوعی\n🜂 امنیت\n🖥 اسمبل کامپیوتر', 'قیمت': 'قیمت پروژه‌ها بستگی به نوع کار داره. برای مشاوره رایگان با ما تماس بگیر.', 'تیم': 'تیم AHURIVAN:\n𖤍 AHURA\n☰ MITRA\n⚔ VAYU\n◈ ANAHITA', 'تماس': '✉ ahurivan@gmail.com\n☏ +98 993 920 9739\n📱 تلگرام: @ahurivan', 'سلام': 'سلام! به قلمرو AHURIVAN خوش آمدی 🖤 چطور می‌تونم کمکت کنم؟' };
  function addMessage(text, sender) { const msg = document.createElement('div'); msg.className = `chat-msg ${sender}`; msg.textContent = text; chatbotMessages.appendChild(msg); chatbotMessages.scrollTop = chatbotMessages.scrollHeight; }
  function getBotResponse(text) { const lower = text.toLowerCase().trim(); for (const key in botResponses) { if (lower.includes(key)) return botResponses[key]; } return 'متوجه نشدم. می‌تونی بپرسی: خدمات، قیمت، تیم، تماس'; }
  chatbotForm.addEventListener('submit', (e) => { e.preventDefault(); const text = chatbotInput.value.trim(); if (!text) return; addMessage(text, 'user'); chatbotInput.value = ''; setTimeout(() => addMessage(getBotResponse(text), 'bot'), 500); });
  quickReplies.querySelectorAll('button').forEach(btn => { btn.addEventListener('click', () => { const msg = btn.dataset.msg; addMessage(msg, 'user'); setTimeout(() => addMessage(getBotResponse(msg), 'bot'), 500); }); });
}

let logoClicks = 0, logoTimer; const logo = document.querySelector('.logo'); const easterEgg = document.getElementById('easterEgg'); const easterEggClose = document.getElementById('easterEggClose');
if (logo) { logo.addEventListener('click', (e) => { logoClicks++; clearTimeout(logoTimer); logoTimer = setTimeout(() => { logoClicks = 0; }, 2000); if (logoClicks >= 5) { e.preventDefault(); easterEgg.classList.add('open'); logoClicks = 0; showToast('𖤍 طلسم فعال شد!'); } }); easterEggClose.addEventListener('click', () => easterEgg.classList.remove('open')); easterEgg.addEventListener('click', (e) => { if (e.target === easterEgg) easterEgg.classList.remove('open'); }); }

// ═══════════════════════════════════════════
// Phase 2: Live Status, Terminal, GitHub
// ═══════════════════════════════════════════
const sysTimeEl = document.getElementById('sysTime'); const sysUsersEl = document.getElementById('sysUsers');
if (sysTimeEl) { setInterval(() => { const now = new Date(); sysTimeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false }); sysUsersEl.textContent = Math.floor(Math.random() * 20) + 40; }, 1000); }

const terminalInput = document.getElementById('terminalInput'); const terminalBody = document.getElementById('terminalBody');
const terminalCommands = { 'help': 'Available commands:\n- about: Who we are\n- skills: Our powers\n- projects: What we built\n- contact: How to reach us\n- hell: Unleash the darkness\n- clear: Clear the terminal', 'about': 'AHURIVAN is a group of tech enthusiasts who code in the dark and build the future. We do web, AI, security, and hardware assembly.', 'skills': 'Web Dev (React/Next.js), Python, Adobe Tools, AI/ML, Cybersecurity, Hardware Assembly.', 'projects': 'Nova Cloud, Oracle AI, Umbra Security, Vault Web3. Check the Portfolio section for more.', 'contact': 'Email: ahurivan@gmail.com\nPhone: +98 993 920 9739\nTelegram/Insta: @ahurivan', 'hell': 'UNLEASHING THE DARKNESS... 😈', 'sudo': 'Nice try! You do not have root privileges here. 😉', 'date': new Date().toString() };
if (terminalInput) {
  document.querySelector('.terminal-body').addEventListener('click', () => terminalInput.focus());
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const inputVal = terminalInput.value.trim().toLowerCase(); terminalInput.value = '';
      const cmdLine = document.createElement('p'); cmdLine.innerHTML = `<span style="color: #0f0;">$</span> ${inputVal}`; terminalBody.appendChild(cmdLine);
      let response = '';
      if (inputVal === '') { response = ''; } else if (inputVal === 'clear') { terminalBody.innerHTML = '<p>Welcome to AHURIVAN OS v1.0.0</p><p>Type <span style="color: #fff;">\'help\'</span> to see available commands.</p><br>'; return; } else if (terminalCommands[inputVal]) { response = terminalCommands[inputVal]; if (inputVal === 'hell') htmlEl.classList.add('hell-mode'); } else { response = `Command not found: ${inputVal}. Type 'help' for a list of commands.`; }
      if (response) { const resLine = document.createElement('p'); resLine.style.whiteSpace = 'pre-wrap'; resLine.innerHTML = response; terminalBody.appendChild(resLine); }
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });
}

const GITHUB_USERNAME = 'wallpapersmn'; 
async function fetchGitHubRepos() {
  const container = document.getElementById('github-repos'); if (!container) return;
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=3`); if (!res.ok) throw new Error('Failed'); const repos = await res.json();
    if (repos.length === 0) { container.innerHTML = '<p style="color: var(--text-muted);">هیچ ریپازیتوری عمومی پیدا نشد.</p>'; return; }
    container.innerHTML = repos.map(repo => `<a href="${repo.html_url}" target="_blank" class="repo-card"><h4><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-left: 4px;"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg> ${repo.name}</h4><p>${repo.description || 'بدون توضیحات'}</p><div class="repo-meta"><span>⭐ ${repo.stargazers_count}</span><span>🍴 ${repo.forks_count}</span><span>👁 ${repo.watchers_count}</span></div></a>`).join('');
    document.querySelectorAll('.repo-card').forEach(card => {
      card.classList.add('card-3d', 'reveal', 'active');
      card.addEventListener('mousemove', (e) => { const rect = card.getBoundingClientRect(); const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8; const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8; card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`; });
      card.addEventListener('mouseleave', () => card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`);
    });
  } catch (err) { container.innerHTML = '<p style="color: #ff3b3b; font-family: monospace;">⚠️ اتصال به گیت‌هاب برقرار نشد (محدودیت API یا اینترنت).</p>'; }
}
fetchGitHubRepos();

// ═══════════════════════════════════════════
// Phase 3: Project Modal & Booking
// ═══════════════════════════════════════════
const projectData = {
  nova: { title: 'پلتفرم ابری Nova', tagline: 'Cloud Infrastructure // 001', icon: '</>', desc: 'Nova یک پلتفرم ابری مقیاس‌پذیر برای استارتاپ‌هاست که به آن‌ها اجازه می‌دهد زیرساخت خود را بدون درگیری با پیچیدگی‌های DevOps مدیریت کنند. این پروژه با استفاده از معماری میکروسرویس و Kubernetes ساخته شده است.', features: ['پشتیبانی از ۵۰,۰۰۰+ کاربر فعال روزانه', 'زمان آپ‌تایم ۹۹.۹۹٪', 'مقیاس‌پذیری خودکار بر اساس بار ترافیک', 'پنل مدیریت اختصاصی برای مدیریت منابع'], tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS'] },
  oracle: { title: 'موتور هوش مصنوعی ORACLE', tagline: 'AI / ML Engine // 002', icon: '{AI}', desc: 'ORACLE یک موتور پیش‌بینی رفتار کاربر است که با استفاده از مدل‌های یادگیری عمیق، الگوهای پنهان در داده‌ها را کشف می‌کند. این سیستم به کسب‌وکارها کمک می‌کند تا تصمیمات بهتری بگیرند.', features: ['دقت پیش‌بینی ۹۴٪', 'پردازش ۱ میلیون رویداد در روز', 'API اختصاصی برای اتصال به سیستم‌های دیگر', 'داشبورد تحلیلی real-time'], tech: ['Python', 'TensorFlow', 'FastAPI', 'MongoDB', 'Redis'] },
  umbra: { title: 'شبکه امن Umbra', tagline: 'Cybersecurity Network // 003', icon: '[S]', desc: 'Umbra یک شبکه ارتباطی رمزنگاری‌شده end-to-end برای سازمان‌های حساس است. این پروژه با تمرکز بر حریم خصوصی و امنیت طراحی شده و از پروتکل‌های رمزنگاری پیشرفته استفاده می‌کند.', features: ['رمزنگاری AES-256', 'احراز هویت چندعاملی (MFA)', 'معماری Zero-Trust', 'لاگ‌های امنیتی غیرقابل تغییر'], tech: ['Rust', 'Go', 'WebRTC', 'PostgreSQL', 'Terraform'] },
  vault: { title: 'اپ مالی Vault', tagline: 'Web3 Wallet // 004', icon: '0x04', desc: 'Vault یک کیف پول غیرمتمرکز نسل جدید است که به کاربران اجازه می‌دهد دارایی‌های دیجیتال خود را به صورت امن مدیریت کنند. این پروژه روی بلاک‌چین اتریوم و با قراردادهای هوشمند ساخته شده است.', features: ['پشتیبانی از ۲۰,۰۰۰+ کاربر فعال', 'قراردادهای هوشمند Audited شده', 'رابط کاربری ساده برای مبتدیان', 'پشتیبانی از NFT و توکن‌های ERC-20'], tech: ['Solidity', 'React', 'Web3.js', 'Ethereum', 'Hardhat'] }
};
const modal = document.getElementById('projectModal'); const modalBody = document.getElementById('modalBody');
function openProjectModal(projectId) {
  const data = projectData[projectId]; if (!data) return;
  modalBody.innerHTML = `<div class="project-modal-header"><div class="icon-placeholder">${data.icon}</div><h2>${data.title}</h2><p class="tagline">${data.tagline}</p></div><div class="project-modal-body"><p>${data.desc}</p><h4>ویژگی‌های کلیدی</h4><ul>${data.features.map(f => `<li>${f}</li>`).join('')}</ul><h4>تکنولوژی‌های استفاده شده</h4><div class="tech-tags">${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div></div>`;
  modal.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeProjectModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
if (modal) { modal.addEventListener('click', (e) => { if (e.target === modal) closeProjectModal(); }); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeProjectModal(); });

// ═══════════════════════════════════════════
// Phase 4: Booking Form (Honeypot)
// ═══════════════════════════════════════════
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const honeypot = bookingForm.querySelector('input[name="website"]');
    if (honeypot && honeypot.value !== '') {
      document.getElementById('bookingStatus').textContent = '✗ خطا! درخواست اسپم شناسایی شد.';
      return;
    }

    const bookingStatus = document.getElementById('bookingStatus'); 
    bookingStatus.textContent = '⏳ در حال ثبت درخواست...';
    setTimeout(() => { 
      bookingStatus.textContent = '✓ درخواست رزرو شما ثبت شد. به‌زودی با شما تماس می‌گیریم.'; 
      bookingForm.reset(); 
      showToast('درخواست رزرو ثبت شد ✓'); 
      setTimeout(() => { bookingStatus.textContent = ''; }, 4000); 
    }, 1000);
  });
}