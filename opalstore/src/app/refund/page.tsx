"use client";

export default function RefundPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "8px" }}>Kebijakan Refund</h1>
        <p style={{ color: "#555555", fontSize: "13px", marginBottom: "32px" }}>Terakhir diperbarui: 18 Juni 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>1. Ketentuan Umum</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Karena sifat produk digital yang kami jual, kebijakan refund kami dirancang untuk melindungi kedua belah pihak. Harap baca kebijakan ini dengan seksama sebelum melakukan pembelian.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>2. Refund Dapat Dilakukan</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Refund dapat dilakukan dalam kondisi berikut:
            </p>
            <ul style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>Produk tidak dapat diakses dalam 24 jam setelah pembayaran (bukan karena kesalahan pengguna)</li>
              <li>Produk yang diterima tidak sesuai dengan deskripsi yang tertera</li>
              <li>Duplikasi pembayaran untuk produk yang sama</li>
              <li>Kesalahan teknis dari sistem kami yang mengakibatkan produk tidak terkirim</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>3. Refund Tidak Dapat Dilakukan</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Refund tidak berlaku untuk:
            </p>
            <ul style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>Produk yang sudah diakses dan digunakan</li>
              <li>Perubahan pikiran setelah pembelian</li>
              <li>Ketidakcocokan perangkat atau browser pengguna</li>
              <li>Pelanggaran ketentuan layanan dari penyedia produk</li>
              <li>Akun yang diblokir karena penyalahgunaan</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>4. Prosedur Pengajuan Refund</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Untuk mengajukan refund:
            </p>
            <ol style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "8px" }}>
              <li>Hubungi kami melalui WhatsApp atau email dalam waktu 3 hari setelah pembelian</li>
              <li>Sertakan bukti pembayaran dan detail transaksi</li>
              <li>Jelaskan alasan pengajuan refund</li>
              <li>Tim kami akan meninjau dalam 1-3 hari kerja</li>
            </ol>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>5. Waktu Proses Refund</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Jika refund disetujui, proses pengembalian dana akan dilakukan dalam 3-7 hari kerja melalui metode pembayaran asli. Biaya admin dari penyedia pembayaran mungkin tidak termasuk dalam jumlah refund.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>6. Produk Bermasalah</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Jika Anda mengalami masalah dengan produk yang dibeli (akun tidak bisa login, layanan error, dll), silakan hubungi kami terlebih dahulu. Kami akan berusaha memberikan solusi atau penggantian sebelum proses refund.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>7. Hubungi Kami</h2>
            <p style={{ color: "#999999", fontSize: "14px", lineHeight: "1.8" }}>
              Untuk pertanyaan atau pengajuan refund, hubungi kami melalui:
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
