const htmlEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  const themeIcon = themeToggle.querySelector('.theme-icon');
  function applyTheme(theme) { if (theme === 'dark') { htmlEl.setAttribute('data-theme', 'dark'); if (themeIcon) themeIcon.textContent = '☀'; } else { htmlEl.removeAttribute('data-theme'); if (themeIcon) themeIcon.textContent = '☾'; } }
  const saved = localStorage.getItem('ahurivan-theme');
  if (saved) applyTheme(saved); else applyTheme((new Date().getHours() >= 20 || new Date().getHours() < 6) ? 'dark' : 'light');
  themeToggle.addEventListener('click', () => { const isDark = htmlEl.getAttribute('data-theme') === 'dark'; const newTheme = isDark ? 'light' : 'dark'; applyTheme(newTheme); localStorage.setItem('ahurivan-theme', newTheme); });
}

// Reading Progress
const progressBar = document.getElementById('readingProgress');
if (progressBar) {
  window.addEventListener('scroll', () => { const docHeight = document.documentElement.scrollHeight - window.innerHeight; const scrolled = (window.scrollY / docHeight) * 100; progressBar.style.width = scrolled + '%'; }, { passive: true });
}

// Toast
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) { if (!toast) return; toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000); }

// Share
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.share; const url = window.location.href; const title = document.title;
    if (type === 'copy') { navigator.clipboard.writeText(url).then(() => showToast('لینک کپی شد ✓')); }
    else if (type === 'twitter') { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank'); }
    else if (type === 'telegram') { window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank'); }
    else if (type === 'whatsapp') { window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank'); }
  });
});

// Bookmark
const bookmarkBtn = document.getElementById('bookmarkBtn');
if (bookmarkBtn) {
  const slug = bookmarkBtn.dataset.slug;
  let saved = JSON.parse(localStorage.getItem('ahurivan-bookmarks') || '[]');
  if (saved.includes(slug)) { bookmarkBtn.classList.add('saved'); bookmarkBtn.innerHTML = '★ ذخیره شده'; }
  bookmarkBtn.addEventListener('click', () => {
    if (saved.includes(slug)) { saved = saved.filter(s => s !== slug); bookmarkBtn.classList.remove('saved'); bookmarkBtn.innerHTML = '☆ ذخیره مقاله'; showToast('از ذخیره‌ها حذف شد'); }
    else { saved.push(slug); bookmarkBtn.classList.add('saved'); bookmarkBtn.innerHTML = '★ ذخیره شده'; showToast('مقاله ذخیره شد ★'); }
    localStorage.setItem('ahurivan-bookmarks', JSON.stringify(saved));
  });
}