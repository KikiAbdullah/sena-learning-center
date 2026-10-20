document.documentElement.classList.add('has-js');

const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');

if (menuToggle && header && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Tutup navigasi' : 'Buka navigasi');
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Buka navigasi');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('nav-open')) {
      header.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Buka navigasi');
      menuToggle.focus();
    }
  });
}

const updateHeader = () => {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
};
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Filter the program cards without navigating away from the page.
const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));
const programCards = Array.from(document.querySelectorAll('.program-card'));
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    programCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(/\s+/);
      const visible = filter === 'all' || categories.includes(filter);
      card.hidden = !visible;
    });
  });
});

// A small, no-data-stored class guide. The recommendation is only a starting point.
const classFinder = document.getElementById('classFinder');
if (classFinder) {
  const ageSelect = document.getElementById('childAge');
  const interestSelect = document.getElementById('childInterest');
  const result = document.getElementById('finderResult');
  const resultTitle = document.getElementById('resultTitle');
  const resultText = document.getElementById('resultText');
  const resultLink = document.getElementById('resultLink');

  const ageNames = {
    baby: '6–12 bulan',
    toddler: '1–4 tahun',
    preschool: 'TK / pra-SD',
    primary: 'sekolah dasar',
    daycare: 'membutuhkan penitipan'
  };
  const interestNames = {
    sensory: 'sensori dan bermain',
    nature: 'alam dan kegiatan outdoor',
    creative: 'kreasi dan soft skill',
    academic: 'calistung atau pelajaran SD',
    fullday: 'rutinitas sehari penuh'
  };
  const recommendations = {
    sensory: {
      title: 'Kelas sensori & bermain',
      text: 'Pilihan awal untuk menjelajah lewat sentuhan, gerak, dan permainan. Profil Sena mencantumkan sesi sensori 60–90 menit dengan 3 kegiatan; admin dapat membantu mengecek kelompok usia dan paket yang sedang tersedia.',
      program: 'kelas sensori dan bermain'
    },
    nature: {
      title: 'Kelas alam & outdoor',
      text: 'Arah yang cocok untuk rasa ingin tahu tentang alam. Tema, rentang usia, dan agenda kelas outdoor dapat berubah—tanyakan jadwal aktif kepada admin.',
      program: 'kelas alam dan kegiatan outdoor'
    },
    creative: {
      title: 'Workshop & kreasi',
      text: 'Ruang untuk membuat, mencoba ide, dan berkolaborasi. Profil Sena memberi contoh kegiatan seperti meronce, dekorasi kue, dan baking; tema berikutnya dapat ditanyakan langsung.',
      program: 'workshop kreativitas dan soft skill'
    },
    calistung: {
      title: 'Bimbingan calistung',
      text: 'Untuk anak TK dan seusianya. Profil 2024 mencantumkan 2 pertemuan per minggu, masing-masing 60–90 menit; silakan cek jadwal dan lokasi yang tersedia.',
      program: 'bimbingan calistung'
    },
    primary: {
      title: 'Bimbingan belajar SD',
      text: 'Untuk siswa sekolah dasar. Profil 2024 mencantumkan 3 pertemuan per minggu, masing-masing 60–90 menit, di Prigen dan Jl. Juanda, Pandaan. Konfirmasi jadwal aktif kepada admin.',
      program: 'bimbingan belajar sekolah dasar'
    },
    daycare: {
      title: 'Penitipan anak',
      text: 'Tanyakan pilihan paket harian atau bulanan. Profil 2024 mencantumkan waktu 07.00–16.00; ketersediaan, jam, dan detail layanan terbaru perlu dikonfirmasi.',
      program: 'penitipan anak'
    },
    ask: {
      title: 'Konsultasi program yang sesuai',
      text: 'Usia dan minat ini bisa punya beberapa jalur. Admin Sena dapat membantu memastikan kelompok, kesiapan, dan jadwal yang paling sesuai.',
      program: 'konsultasi program'
    }
  };

  classFinder.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!classFinder.reportValidity()) return;

    const age = ageSelect.value;
    const interest = interestSelect.value;
    let recommendation;

    if (age === 'daycare' || interest === 'fullday') {
      recommendation = recommendations.daycare;
    } else if (interest === 'creative') {
      recommendation = recommendations.creative;
    } else if (interest === 'nature') {
      recommendation = recommendations.nature;
    } else if (interest === 'academic') {
      if (age === 'primary') recommendation = recommendations.primary;
      else if (age === 'preschool') recommendation = recommendations.calistung;
      else recommendation = recommendations.ask;
    } else if (interest === 'sensory') {
      if (age === 'baby' || age === 'toddler') recommendation = recommendations.sensory;
      else recommendation = recommendations.ask;
    } else if (age === 'primary') {
      recommendation = recommendations.primary;
    } else if (age === 'preschool') {
      recommendation = recommendations.calistung;
    } else if (age === 'baby' || age === 'toddler') {
      recommendation = recommendations.sensory;
    } else {
      recommendation = recommendations.ask;
    }

    resultTitle.textContent = recommendation.title;
    resultText.textContent = recommendation.text;
    const message = `Halo admin Sena, saya ingin berkonsultasi. Usia/kebutuhan anak: ${ageNames[age]}. Minat: ${interestNames[interest]}. Rekomendasi awal: ${recommendation.program}. Mohon informasi kelompok usia, jadwal, lokasi, dan biaya terbaru.`;
    resultLink.href = `https://wa.me/6285890016310?text=${encodeURIComponent(message)}`;
    result.hidden = false;
    result.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
}

// Progressive reveal. If IntersectionObserver is unavailable, everything remains visible.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -25px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
