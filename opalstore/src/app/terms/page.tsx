"use client";

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "8px" }}>Syarat & Ketentuan</h1>
        <p style={{ color: "#555555", fontSize: "13px", marginBottom: "32px" }}>Terakhir diperbarui: 18 Juni 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>1. Penerimaan Syarat</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Dengan mengakses dan menggunakan layanan OpalStore, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak boleh menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>2. Deskripsi Layanan</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              OpalStore menyediakan akses ke langganan premium dan produk digital termasuk namun tidak terbatas pada:
            </p>
            <ul style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>Layanan AI (ChatGPT Plus, Gemini Pro)</li>
              <li>Platform streaming (Netflix, Spotify)</li>
              <li>Desain (Canva Pro)</li>
              <li>Server (VPS)</li>
              <li>Produk digital lainnya</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>3. Akun Pengguna</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Untuk menggunakan layanan kami, Anda harus:
            </p>
            <ul style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>Berusia minimal 17 tahun atau memiliki izin dari orang tua/wali</li>
              <li>Memberikan informasi yang akurat dan lengkap</li>
              <li>Menjaga keamanan akun Anda</li>
              <li>Bertanggung jawab atas semua aktivitas di akun Anda</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>4. Pembayaran dan Harga</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Semua harga yang tertera dalam Rupiah (IDR). Pembayaran dapat dilakukan melalui metode yang tersedia (QRIS, OVO, DANA, ShopeePay). Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>5. Pengiriman Produk</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Setelah pembayaran terkonfirmasi, akses produk akan dikirim melalui WhatsApp atau email yang terdaftar. Waktu pengiriman bervariasi tergantung jenis produk, namun umumnya dalam hitungan menit hingga 1x24 jam.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>6. Larangan Penggunaan</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Anda dilarang:
            </p>
            <ul style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>Menjual kembali akses yang dibeli kepada pihak lain</li>
              <li>Membagikan akun atau kredensial kepada orang lain</li>
              <li>Menggunakan produk untuk aktivitas ilegal</li>
              <li>Melanggar ketentuan layanan dari penyedia produk asli</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>7. Batasan Tanggung Jawab</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              OpalStore bertindak sebagai reseller dan tidak berafiliasi langsung dengan penyedia produk asli. Kami tidak bertanggung jawab atas perubahan layanan, kebijakan, atau kualitas dari penyedia produk asli.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>8. Perubahan Syarat</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku sejak dipublikasikan di situs ini. Penggunaan berkelanjutan setelah perubahan dianggap sebagai penerimaan terhadap syarat yang baru.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>9. Hubungi Kami</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami melalui:
            </p>
            <ul style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>WhatsApp: +62 856-6913-0605</li>
              <li>Email: opalagent.ai@gmail.com</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
