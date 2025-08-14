const SCRIPT_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiY710Vku9YniN1r328s5r7d9nZMdkdoHRaBeEQ4zqKkDpIqBluk2-zbHz_5U1u8cg-nprRFeaet0UiQuC_sEblkVjBKslidUI_HTrjIMiVbRkfhJg4sucgDS9qRWlRX6IHP2apXTsu0pTodvQo4kokI8l1OktHWeWs3NwGp2OOpTzH6PX_o4mn3dI9whn6hiuE6Q-71BwEUw1EgxOYuyeQNDyXkpUxkPPnxvUZD_1372FJW9WF4zV-MRkYZ5lRvJKN2nuNuJEIahY3V9ktTczQ6IVRKm3Rz4ByAXfG&lib=MWyxI5d25Sy55M9_f8ezk1TcJCrGNgL59'; // Dán URL web app
const APP = document.getElementById('app');

async function api(action, params = {}) {
  const url = new URL(SCRIPT_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}

const routes = {
  '/home': renderHome,
  '/news': renderNews,
  '/schedule': renderSchedule,
  '/renluyen': renderRenLuyen,
  '/faces': renderFaces,
  '/album': renderAlbum,
  '/docs': renderDocs,
  '/contact': renderContact,
};

function navigate() {
  const path = location.hash.replace('#', '') || '/home';
  (routes[path] || renderHome)();
}
window.addEventListener('hashchange', navigate);
window.addEventListener('load', () => {
  navigate();
  document.getElementById('btnPing').addEventListener('click', async () => {
    try {
      const r = await api('ping');
      alert('API OK: ' + JSON.stringify(r));
    } catch (e) {
      alert('API lỗi, kiểm tra SCRIPT_URL trong assets/app.js');
    }
  });
});

async function renderHome() {
  APP.innerHTML = `
    <section class="hero p-4 p-md-5 mb-4">
      <div class="row align-items-center g-4">
        <div class="col-md-7">
          <h1 class="display-6 fw-bold">Website lớp 10A8</h1>
          <p class="lead mb-0">Tin tức • Lịch học/thi • Rèn luyện • Album • Tài liệu</p>
        </div>
        <div class="col-md-5">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="me-3"><span class="badge badge-soft">Mục tiêu</span></div>
                <div><div><strong>Lighthouse ≥ 90</strong> (mobile)</div><div>Triển khai nhanh, dữ liệu từ Google Sheets</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="row g-3">
      <div class="col-md-4"><a href="#/news" class="text-decoration-none">
        <div class="card card-hover h-100"><div class="card-body">
          <h5 class="card-title">Tin tức</h5><p class="mb-0 text-muted">Cập nhật hoạt động lớp</p>
        </div></div></a></div>
      <div class="col-md-4"><a href="#/schedule" class="text-decoration-none">
        <div class="card card-hover h-100"><div class="card-body">
          <h5 class="card-title">Lịch học/thi</h5><p class="mb-0 text-muted">Theo tuần, dễ theo dõi</p>
        </div></div></a></div>
      <div class="col-md-4"><a href="#/renluyen" class="text-decoration-none">
        <div class="card card-hover h-100"><div class="card-body">
          <h5 class="card-title">Điểm rèn luyện</h5><p class="mb-0 text-muted">Công khai minh bạch</p>
        </div></div></a></div>
    </div>`;
}

async function renderNews() {
  APP.innerHTML = `<h2 class="mb-3">Tin tức</h2><div id="newsList" class="row g-3"></div>`;
  try {
    const items = await api('tintuc', { limit: 10 });
    const wrap = document.getElementById('newsList');
    wrap.innerHTML = items.map(it => `
      <div class="col-md-6">
        <div class="card h-100">
          ${it.Anh ? `<img src="${it.Anh}" class="card-img-top" alt="" loading="lazy">` : ''}
          <div class="card-body">
            <h5 class="card-title">${it.TieuDe}</h5>
            <p class="card-text small text-muted">${it.Ngay} • ${it.TacGia}</p>
            <p class="card-text">${(it.NoiDung || '').slice(0, 140)}...</p>
          </div>
        </div>
      </div>`).join('');
  } catch (e) { APP.innerHTML += `<div class="alert alert-danger">Không tải được tin tức.</div>`; }
}

async function renderSchedule() {
  APP.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Lịch học/thi</h2>
      <input type="week" id="week" class="form-control" style="max-width:220px">
    </div>
    <div class="table-responsive"><table class="table table-striped">
      <thead><tr><th>Ngày</th><th>Môn</th><th>Tiết</th><th>Ghi chú</th></tr></thead>
      <tbody id="tb"></tbody>
    </table></div>`;
  const week = document.getElementById('week');
  week.addEventListener('change', load);
  load();
  async function load() {
    const items = await api('lichhoc', { week: week.value || '' });
    document.getElementById('tb').innerHTML = items.map(it => `
      <tr><td>${it.Ngay}</td><td>${it.Mon}</td><td>${it.Tiet}</td><td>${it.GhiChu || ''}</td></tr>
    `).join('');
  }
}

async function renderRenLuyen() {
  APP.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Bảng điểm rèn luyện tuần</h2>
      <input type="week" id="week" class="form-control" style="max-width:220px">
    </div>
    <div class="table-responsive"><table class="table table-hover align-middle">
      <thead><tr><th>Họ tên</th><th>Điểm</th><th>Xếp loại</th></tr></thead>
      <tbody id="tb"></tbody>
    </table></div>`;
  const week = document.getElementById('week');
  week.addEventListener('change', load);
  load();
  async function load() {
    const items = await api('renluyen', { week: week.value || '' });
    document.getElementById('tb').innerHTML = items.map(it => `
      <tr><td>${it.HoTen}</td><td><span class="badge bg-light text-dark">${it.Diem}</span></td><td>${it.XepLoai || ''}</td></tr>
    `).join('');
  }
}

async function renderAlbum() {
  APP.innerHTML = `<h2 class="mb-3">Album ảnh</h2><div class="row g-3" id="grid"></div>`;
  try {
    const items = await api('album', { limit: 12 });
    const grid = document.getElementById('grid');
    grid.innerHTML = items.map(it => `
      <div class="col-6 col-md-3">
        <div class="card">
          <img src="${it.LinkAnh}" class="card-img-top" alt="${it.TieuDe}" loading="lazy">
          <div class="card-body"><div class="small">${it.TieuDe}</div></div>
        </div>
      </div>`).join('');
  } catch (e) { APP.innerHTML += `<div class="alert alert-danger">Không tải được album.</div>`; }
}

async function renderDocs() {
  APP.innerHTML = `<h2 class="mb-3">Tài liệu học tập</h2><div id="list"></div>`;
  try {
    const items = await api('tailieu', {});
    document.getElementById('list').innerHTML = items.map(it => `
      <div class="card mb-2"><div class="card-body d-flex justify-content-between">
        <div><strong>${it.TenFile}</strong><div class="small text-muted">${it.Mon} • ${it.MoTa || ''}</div></div>
        <a href="${it.Link}" target="_blank" class="btn btn-sm btn-brand">Tải</a>
      </div></div>
    `).join('');
  } catch (e) { APP.innerHTML += `<div class="alert alert-danger">Không tải được tài liệu.</div>`; }
}

function renderFaces() {
  APP.innerHTML = `<h2 class="mb-3">Gương mặt tiêu biểu</h2>
    <p class="text-muted">Mục này có thể lấy từ điểm rèn luyện top hoặc cập nhật thủ công theo tuần.</p>`;
}

function renderContact() {
  APP.innerHTML = `<h2 class="mb-3">Liên hệ</h2>
  <ul class="list-unstyled">
    <li><strong>GVCN:</strong> thầy Vũ Tiến Lực</li>
    <li><strong>Email:</strong> (cập nhật)</li>
    <li><strong>Địa chỉ:</strong> THPT Nguyễn Hữu Cảnh</li>
  </ul>`;
}
