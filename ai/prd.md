Product Requirement Document (PRD)
Website Profil Pondok Pesantren Mambaul Hikmah

1. Ringkasan Proyek
   1.1 Latar Belakang
   Pondok Pesantren Mambaul Hikmah yang terletak di Desa Tegalwangi, Kecamatan Talang, Kabupaten Tegal memerlukan sebuah platform digital berbasis web sebagai media informasi resmi. Website ini bertujuan untuk mengenalkan profil pesantren, visi-misi, serta mempublikasikan kegiatan atau artikel (blog) kepada masyarakat luas, calon santri, dan wali santri.
   1.2 Stack Teknologi
   Framework: Astro (Static Site Generation / SSG untuk performa tinggi dan SEO optimal).
   Styling: Tailwind CSS (Untuk desain modern, responsif, dan fleksibel).
   Content Management (Blog): Markdown / MDX bawaan Astro (ringan dan mudah dikelola).
2. Struktur Menu & Arsitektur Informasi
   Website akan menggunakan struktur satu halaman utama (Landing Page) dengan beberapa halaman detail (Multipage untuk Blog/Berita):
   Home (Beranda)
   Profil (Sejarah, Visi, Misi, & Motto)
   Program Pendidikan / Akademik (Kitab Salaf, Al-Qur'an)
   Blog / Berita (Halaman List & Detail Artikel)
   Kontak
3. Kebutuhan Fitur & Layout Konten
   3.1 Hero Section (Slider Banner)
   Komponen: Komponen slider/carousel responsif yang menampilkan foto-foto kegiatan pesantren.
   Overlay Konten: Di atas slider banner terdapat teks selamat datang, nama pesantren, dan tombol Call to Action (CTA).
   Konten Teks:
   Headline: Selamat Datang di Pondok Pesantren Mambaul Hikmah
   Sub-headline: Membentuk santri yang Beriman, Bertakwa, Berilmu, dan Berakhlak.
   CTA Button: "Daftar Sekarang" atau "Pelajari Selengkapnya".
   3.2 Section Profil & Strategis
   Deskripsi: Menjelaskan lokasi geografis yang strategis dan fokus lembaga.
   Konten:
   "Pondok Pesantren Mambaul Hikmah terletak di Desa Tegalwangi, Kecamatan Talang, Kabupaten Tegal. Letaknya yang strategis dan mudah dijangkau menjadikan pesantren ini berkembang sebagai lembaga pendidikan Islam yang tidak hanya berfokus pada ilmu agama, tetapi juga pembentukan karakter santri."
   3.3 Section Visi, Misi, & Motto
   Visual Presentasi: Menggunakan grid sistem Tailwind (3 kolom atau tab interaktif).
   Detail Konten:
   Visi: Membentuk santri yang Beriman, Bertakwa, Berilmu, dan Berakhlak.
   Misi:
   Membiasakan ibadah wajib dan sunnah.
   Membimbing ibadah sesuai ajaran Rasulullah.
   Mengajarkan Al-Qur’an dan kitab salaf.
   Membentuk kebiasaan berperilaku terpuji.
   Motto: "Ilmu, Amal, Tazkiyah" (Diberikan highlight visual khusus, misalnya dengan font italic besar atau box dengan background kontras).
   3.4 Section Blog / Berita Terbaru
   Fitur: Menampilkan 3-4 artikel/berita terbaru dari pesantren secara dinamis menggunakan Astro Content Collections.
   Komponen Kartu Blog (Card): Thumbnail gambar, judul artikel, tanggal rilis, cuplikan teks short-description, dan tombol "Baca Selengkapnya".
   Halaman Terkait:
   /blog (Menampilkan seluruh daftar artikel dengan pagination).
   /blog/[slug] (Halaman detail membaca artikel dengan format markdown yang rapi menggunakan Tailwind Typography (prose)).
   3.5 Section Kontak & Footer
   Konten: Alamat lengkap (Desa Tegalwangi, Talang, Tegal), nomor WhatsApp admin, email, dan integrasi Google Maps (jika diperlukan).
4. Kebutuhan Non-Fungsional (Non-Functional Requirements)
   Parameter Target Spesifikasi
   Performa & Kecepatan Skor Google Lighthouse minimal 95+ untuk Performance, Accessibility, dan SEO (karena optimasi build-time dari Astro).
   Responsivitas Mobile-first design. Wajib tampil sempurna di perangkat smartphone, tablet, dan desktop.
   Desain & Estetika Nuansa Islami modern dengan palet warna dominan Hijau (Islamic Green), Putih, dan aksen Emas/Kuning lembut untuk kesan bersih dan terpercaya.
   SEO Meta tags dinamis pada setiap halaman blog (Judul, Deskripsi, OpenGraph Image untuk kebutuhan share di WhatsApp/Sosmed).
5. Rencana Tahap Implementasi (Astro)
   Inisialisasi Project: Setup Astro dengan template Tailwind CSS.
   Komponen UI Dasar: Membuat Navbar.astro, Footer.astro, dan komponen Layout.astro global.
   Implementasi Hero Slider: Integrasi slider menggunakan library JS ringan (seperti Swiper.js atau Alpine.js) agar tetap performant di Astro.
   Setup Content Collections: Mengonfigurasi folder src/content/blog/ untuk manajemen file .md atau .mdx artikel.
   Styling & Finisihing: Memastikan fungsionalitas responsif Tailwind bekerja dengan baik di semua ukuran layar.
