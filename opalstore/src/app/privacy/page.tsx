"use client";

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "8px" }}>Kebijakan Privasi</h1>
        <p style={{ color: "#555555", fontSize: "13px", marginBottom: "32px" }}>Terakhir diperbarui: 18 Juni 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>1. Informasi yang Kami Kumpulkan</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Kami mengumpulkan informasi yang Anda berikan secara langsung, termasuk:
            </p>
            <ul style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>Nama lengkap</li>
              <li>Alamat email</li>
              <li>Nomor WhatsApp</li>
              <li>Foto profil (jika login via Google)</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>2. Penggunaan Informasi</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Informasi yang kami kumpulkan digunakan untuk:
            </p>
            <ul style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>Memproses transaksi dan pesanan Anda</li>
              <li>Mengirimkan akses produk yang dibeli</li>
              <li>Komunikasi terkait pesanan dan dukungan pelanggan</li>
              <li>Meningkatkan layanan dan pengalaman pengguna</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>3. Perlindungan Data</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi pribadi Anda dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah. Data Anda disimpan di server yang aman dan dienkripsi selama transmisi.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>4. Pembagian Informasi</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali untuk:
            </p>
            <ul style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>Penyedia layanan pembayaran (Tripay) untuk memproses transaksi</li>
              <li>Kepatuhan hukum jika diwajibkan oleh peraturan yang berlaku</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>5. Cookie dan Pelacakan</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Kami menggunakan cookie untuk menjaga sesi login Anda dan meningkatkan pengalaman browsing. Anda dapat mengatur browser untuk menolak semua cookie, namun hal ini mungkin mempengaruhi fungsionalitas situs.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>6. Hak Anda</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Anda memiliki hak untuk:
            </p>
            <ul style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>Mengakses data pribadi Anda</li>
              <li>Memperbarui atau mengoreksi data</li>
              <li>Meminta penghapusan akun dan data</li>
              <li>Menarik persetujuan pemrosesan data</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>7. Perubahan Kebijakan</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau pemberitahuan di situs kami.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>8. Hubungi Kami</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui:
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
