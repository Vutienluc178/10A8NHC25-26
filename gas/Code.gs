const SPREADSHEET_ID = '1OnkG0Eh80nAv7Z8R-EtyLMHcwwqWFQ1LSTBeFyMjwTE'; // Điền ID Spreadsheet
const ALLOWED_ORIGINS = ['*']; // khi deploy thực tế: đổi '*' -> 'https://your-domain.vercel.app'

function getSS() { return SpreadsheetApp.openById(SPREADSHEET_ID); }
function getSheet(name) { return getSS().getSheetByName(name); }

function readRows_(sheetName) {
  const sh = getSheet(sheetName);
  const values = sh.getDataRange().getValues();
  const [header, ...rows] = values;
  return rows.map(r => {
    const o = {};
    header.forEach((h, i) => o[String(h)] = r[i]);
    return o;
  });
}

function respondJSON_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj || {}))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRoleByEmail_(email) {
  try {
    const rows = readRows_('Rbac');
    const row = rows.find(r => (r.Email || '').toString().trim().toLowerCase() === (email || '').toString().trim().toLowerCase());
    return row ? (row.Role || 'Viewer') : 'Viewer';
  } catch (err) { return 'Viewer'; }
}

function canPost_(email) {
  const role = getRoleByEmail_(email);
  return ['GVCN', 'BCS'].includes(role);
}

function doGet(e) {
  const action = (e.parameter.action || '').toLowerCase();
  if (!action) return respondJSON_({ error: 'Bạn cần truyền action, ví dụ: ?action=ping' });

  switch (action) {
    case 'ping':
      return respondJSON_({ ok: true, time: new Date(), action });
    case 'tintuc': {
      const limit = parseInt(e.parameter.limit || '10', 10);
      const items = readRows_('TinTuc').sort((a,b) => new Date(b.Ngay) - new Date(a.Ngay)).slice(0, limit);
      return respondJSON_(items);
    }
    case 'lichhoc': {
      const week = e.parameter.week || '';
      const items = readRows_('LichHoc');
      const filtered = week ? items.filter(x => (x.GhiChu || '').includes(week)) : items;
      return respondJSON_(filtered);
    }
    case 'renluyen': {
      const week = e.parameter.week || '';
      const items = readRows_('RenLuyen');
      const filtered = week ? items.filter(x => String(x.Tuan) === String(week)) : items;
      return respondJSON_(filtered);
    }
    case 'album': {
      const limit = parseInt(e.parameter.limit || '12', 10);
      const items = readRows_('Album').slice(0, limit);
      return respondJSON_(items);
    }
    case 'tailieu': {
      const mon = (e.parameter.mon || '').toLowerCase();
      const items = readRows_('TaiLieu');
      const filtered = mon ? items.filter(x => String(x.Mon || '').toLowerCase() === mon) : items;
      return respondJSON_(filtered);
    }
    default:
      return respondJSON_({ error: 'Action không hợp lệ' });
  }
}

function doPost(e) {
  const action = (e.parameter.action || '').toLowerCase();
  if (action !== 'tintuc') return respondJSON_({ error: 'Action POST không hợp lệ' });

  const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
  const email = (body.email || '') || (Session.getActiveUser().getEmail() || '');

  if (!canPost_(email)) return respondJSON_({ error: 'Không có quyền đăng bài' });

  const sh = getSheet('TinTuc');
  const lastRow = sh.getLastRow() + 1;
  const id = lastRow - 1;
  const row = [id, body.TieuDe, body.NoiDung, body.Ngay || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'), body.TacGia || email, body.Anh || ''];
  sh.getRange(lastRow, 1, 1, row.length).setValues([row]);

  return respondJSON_({ ok: true, id });
}
