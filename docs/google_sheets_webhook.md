Google Sheets webhook (Apps Script)

Tujuan: Terima order JSON dari situs statis dan tambahkan baris baru ke Google Sheet.

Langkah singkat:
1. Buka Google Drive → New → Google Sheets. Buat sheet baru (mis. "Orders").
2. Catat ID spreadsheet dari URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`.
3. Buka Extensions → Apps Script.
4. Ganti kode default dengan script berikut, ganti `SHEET_NAME` jika perlu.
5. Deploy → New deployment → Select type: Web app. Set "Who has access" = Anyone (atau Anyone with link). Klik Deploy dan salin URL.
6. Di website Anda, set `window.ORDER_ENDPOINT = 'PASTE_YOUR_DEPLOY_URL_HERE'` sebelum memuat `cart.html` (atau dalam console) lalu tes checkout.

Apps Script code (paste ke Editor):

```javascript
// Replace with your spreadsheet ID (provided below)
const SPREADSHEET_ID = '1_67GO9rASJiglufS4Hpo4Nwct3LclMNS605ByJxqd7Y';
const SHEET_NAME = 'Orders';

function doPost(e) {
  try {
    let requestBody = '';
    if (e.postData && e.postData.contents) {
      requestBody = e.postData.contents;
    } else if (e.parameter && e.parameter.payload) {
      requestBody = e.parameter.payload;
    }

    const body = requestBody ? JSON.parse(requestBody) : {};
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Created At', 'Order ID', 'Customer Name', 'Email', 'Address', 'City', 'Product', 'Finish', 'Size', 'Quantity', 'Unit Price', 'Line Total']);
    }

    const createdAt = body.createdAt || new Date().toISOString();
    const orderId = body.orderId || Utilities.getUuid();
    const customer = body.customer || {};
    const items = body.items || [];

    items.forEach(item => {
      const qty = item.qty || 0;
      const unitPrice = item.price || 0;
      sheet.appendRow([
        createdAt,
        orderId,
        customer.name || '',
        customer.email || '',
        customer.address || '',
        customer.city || '',
        item.name || '',
        item.finish || '',
        item.size || '',
        qty,
        unitPrice,
        qty * unitPrice
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Important: After pasting this code, save and redeploy your Web App.

1. In Apps Script, choose **Deploy** → **Manage deployments**.
2. Click your existing deployment, then choose **Edit** or **Redeploy**.
3. Ensure access is set to **Anyone** or **Anyone, even anonymous**.
4. Use the same Web App URL in `window.ORDER_ENDPOINT`.

Deployment info (from your environment):

- Spreadsheet ID: `1_67GO9rASJiglufS4Hpo4Nwct3LclMNS605ByJxqd7Y`
- New Web App URL: `https://script.google.com/macros/s/AKfycbxoAPzOgtImPtsMOJtHBIIxnYVegBaPApjxUL_BiJz2r7Kh4IyjsvsN7-8-rXcQqIRU/exec`

Update `window.ORDER_ENDPOINT` in `cart.html` to this new Web App URL, then redeploy Apps Script if needed.

Catatan keamanan:
- Mengatur akses Web app ke "Anyone" memungkinkan siapa saja memanggil endpoint. Untuk produksi, pertimbangkan validasi tambahan (API key di header) atau gunakan server back-end.
- Anda bisa memodifikasi script untuk mengekstrak setiap item jadi baris terpisah jika ingin analitik per item.

Troubleshooting:
- Jika fetch gagal dengan CORS, Apps Script Web App yang di-deploy sebagai Web app (Anyone, even anonymous) umumnya mengizinkan request POST dari browser. Jika ada masalah, cek respon pada Network tab di DevTools.
- Pastikan `SPREADSHEET_ID` benar dan akun yang deploy memiliki akses menulis ke spreadsheet.

Selesai.