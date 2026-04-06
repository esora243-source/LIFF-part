/**
 * Hugmeid - 医学生向けLINE LIFFアプリ
 * メインアプリケーション JavaScript
 * 
 * 実装状況:
 * - LINE LIFF SDK統合 (モック実装)
 * - Supabase REST API連携 (Table API使用)
 * - SPA ルーティング
 * - 認証フロー
 * - 求人・記事・課外活動一覧/詳細
 * - ブックマーク機能
 * - マイページ
 * - プロフィール登録/編集
 */

'use strict';

// ============================================================
// 定数・設定
// ============================================================

const APP_CONFIG = {
  appName: 'Hugmeid',
  version: '1.0.0-phase1',
  liffId: 'LIFF_ID_PLACEHOLDER', // 本番では実際のLIFF IDに置換
<<<<<<< HEAD
=======
  supabaseUrl: 'https://viroweaudljvwbrewstc.supabase.co',
  supabaseAnonKey: 'sb_publishable_hhssWdxzMpc_VQrSWmgw1A_BACfAOMY',
>>>>>>> c25eb19 (feat: マイページをWebアプリ化し、Supabase統合)
  isDev: true, // 開発モード (LIFFモック使用)
};

// カテゴリ表示名マッピング
const JOB_CATEGORY_LABELS = {
  '家庭教師': { emoji: '📚', color: 'badge-primary' },
  'オンライン家庭教師': { emoji: '💻', color: 'badge-blue' },
  '塾講師': { emoji: '🏫', color: 'badge-orange' },
  'ITインターン': { emoji: '🖥️', color: 'badge-purple' },
  '飲食・医療事務': { emoji: '🏥', color: 'badge-gray' },
  'その他': { emoji: '💼', color: 'badge-gray' },
};

const LOCATION_TYPE_LABELS = {
  'オフライン': { label: 'オフライン', cls: 'offline', icon: '📍' },
  'オンライン': { label: 'オンライン', cls: 'online', icon: '🌐' },
  'ハイブリッド': { label: 'ハイブリッド', cls: 'hybrid', icon: '🔄' },
};

const ARTICLE_CATEGORY_LABELS = {
  '勉強': { emoji: '📖', color: 'badge-blue' },
  '起業': { emoji: '💡', color: 'badge-orange' },
  '研究': { emoji: '🔬', color: 'badge-purple' },
  '臨床': { emoji: '🩺', color: 'badge-primary' },
  '留学': { emoji: '✈️', color: 'badge-blue' },
  'その他': { emoji: '📝', color: 'badge-gray' },
};

// ============================================================
// アプリケーション状態
// ============================================================

const AppState = {
  // 現在のページ
  currentPage: 'home',
  
  // ユーザー情報
  user: null,         // LIFFから取得したLINEプロフィール
  dbUser: null,       // DBから取得したユーザーデータ
  isLoggedIn: false,
  isRegistered: false,
  
  // データキャッシュ
  jobs: [],
  articles: [],
  organizations: [],
  bookmarks: [],
  
  // UI状態
  jobFilter: 'all',
  articleFilter: 'all',
  searchQuery: '',
  
  // 詳細表示中のアイテム
  selectedJob: null,
  selectedArticle: null,
  selectedOrg: null,
};

// ============================================================
<<<<<<< HEAD
// LIFF モック / 実装
// ============================================================

=======
// Supabase サービス
// ============================================================

const SupabaseService = {
  client: null,
  
  init() {
    this.client = window.supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey);
  },
  
  async signInWithLine(lineUser) {
    // LINE UIDでSupabase Authにサインイン（カスタム認証）
    // 実際の実装では、サーバーサイドでLINEトークンを検証してSupabase JWTを発行
    // ここではモック: localStorageにセッション情報を保存
    try {
      // 既存ユーザーを検索または作成
      let { data: user, error } = await this.client
        .from('users')
        .select('*')
        .eq('line_uid', lineUser.userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116は見つからない
      
      if (!user) {
        // 新規ユーザー作成
        const { data: newUser, error: insertError } = await this.client
          .from('users')
          .insert([{
            line_uid: lineUser.userId,
            name: lineUser.displayName,
            avatar_url: lineUser.pictureUrl,
          }])
          .select()
          .single();
        
        if (insertError) throw insertError;
        user = newUser;
      }
      
      // モックセッションをlocalStorageに保存
      const mockSession = {
        user: { id: user.id, email: user.line_uid + '@line.local' },
        access_token: 'mock_token_' + user.id,
        refresh_token: 'mock_refresh_' + user.id,
      };
      localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
      
      return user;
    } catch (err) {
      console.error('Supabaseサインインエラー:', err);
      return null;
    }
  },
};

>>>>>>> c25eb19 (feat: マイページをWebアプリ化し、Supabase統合)
const LiffService = {
  initialized: false,
  
  async init() {
    if (APP_CONFIG.isDev) {
      // 開発モード: LIFFをモックする
      console.log('[LIFF] 開発モード: モックLIFFを使用します');
      this.initialized = true;
      return true;
    }
    
    try {
      await liff.init({ liffId: APP_CONFIG.liffId });
      this.initialized = true;
      console.log('[LIFF] 初期化完了');
      return true;
    } catch (err) {
      console.error('[LIFF] 初期化エラー:', err);
      return false;
    }
  },
  
  isLoggedIn() {
    if (APP_CONFIG.isDev) {
      return localStorage.getItem('hugmeid_mock_logged_in') === 'true';
    }
    return liff.isLoggedIn();
  },
  
  login() {
    if (APP_CONFIG.isDev) {
      // 開発モード: モックユーザーでログイン
      localStorage.setItem('hugmeid_mock_logged_in', 'true');
      localStorage.setItem('hugmeid_mock_user', JSON.stringify({
        userId: 'Udev_mock_user_001',
        displayName: '医学 太郎',
        pictureUrl: '',
        statusMessage: '浜松医科大学 3年',
      }));
      return;
    }
    liff.login();
  },
  
  logout() {
    if (APP_CONFIG.isDev) {
      localStorage.removeItem('hugmeid_mock_logged_in');
      localStorage.removeItem('hugmeid_mock_user');
      return;
    }
    liff.logout();
  },
  
  async getProfile() {
    if (APP_CONFIG.isDev) {
      const stored = localStorage.getItem('hugmeid_mock_user');
      if (stored) return JSON.parse(stored);
      return null;
    }
    return liff.getProfile();
  },
  
  isInClient() {
    if (APP_CONFIG.isDev) return false;
    return liff.isInClient();
  },
};

// ============================================================
// API サービス (Table API)
// ============================================================

const ApiService = {
  async get(table, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `tables/${table}${query ? '?' + query : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GET ${table} failed: ${res.status}`);
    return res.json();
  },
  
  async getById(table, id) {
    const res = await fetch(`tables/${table}/${id}`);
    if (!res.ok) throw new Error(`GET ${table}/${id} failed: ${res.status}`);
    return res.json();
  },
  
  async post(table, data) {
    const res = await fetch(`tables/${table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`POST ${table} failed: ${res.status}`);
    return res.json();
  },
  
  async patch(table, id, data) {
    const res = await fetch(`tables/${table}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`PATCH ${table}/${id} failed: ${res.status}`);
    return res.json();
  },
  
  async delete(table, id) {
    const res = await fetch(`tables/${table}/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error(`DELETE ${table}/${id} failed: ${res.status}`);
  },
  
  // ユーザーをline_uidで検索
  async findUserByLineUid(lineUid) {
    const data = await this.get('users', { search: lineUid, limit: 1 });
    const found = data.data?.find(u => u.line_uid === lineUid);
    return found || null;
  },
  
  // ユーザーのブックマーク一覧取得
  async getUserBookmarks(userId) {
    const data = await this.get('bookmarks', { limit: 100 });
    return data.data?.filter(b => b.user_id === userId) || [];
  },
};

// ============================================================
// ルーター (SPA)
// ============================================================

const Router = {
  // ページ定義: page ID → 要素ID
  pages: {
    'login': 'page-login',
    'register': 'page-register',
    'home': 'page-home',
    'jobs': 'page-jobs',
    'job-detail': 'page-job-detail',
    'school': 'page-school',
    'extracurricular': 'page-extracurricular',
    'connections': 'page-connections',
    'mypage': 'page-mypage',
    'bookmarks': 'page-bookmarks',
    'article-detail': 'page-article-detail',
  },
  
  navigate(pageId, options = {}) {
    const prev = AppState.currentPage;
    AppState.currentPage = pageId;
    
    // 全ページ非表示
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
    });
    
    // 対象ページ表示
    const pageEl = document.getElementById(this.pages[pageId]);
    if (pageEl) {
      pageEl.classList.add('active');
    } else {
      console.warn(`Page not found: ${pageId}`);
    }
    
    // ボトムナビ更新
    this._updateBottomNav(pageId);
    
    // ページ固有の初期化
    if (options.init !== false) {
      PageControllers[pageId]?.onEnter?.(options.data);
    }
    
    // スクロールトップ
    const content = pageEl?.querySelector('.page-content');
    if (content) content.scrollTop = 0;
    
    console.log(`[Router] ${prev} → ${pageId}`);
  },
  
  _updateBottomNav(pageId) {
    const mainPages = ['home', 'jobs', 'school', 'extracurricular', 'connections', 'mypage'];
    const tabMap = {
      'home': 'nav-home',
      'jobs': 'nav-jobs',
      'school': 'nav-school',
      'extracurricular': 'nav-extra',
      'connections': 'nav-connections',
      'mypage': 'nav-mypage',
    };
    
    const showNav = !['login', 'register'].includes(pageId);
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
      bottomNav.style.display = showNav ? '' : 'none';
    }
    
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeTab = tabMap[pageId];
    if (activeTab) {
      document.getElementById(activeTab)?.classList.add('active');
    }
  },
};

// ============================================================
// ページコントローラー
// ============================================================

const PageControllers = {
  
  // --- ログインページ ---
  login: {
    onEnter() {},
  },
  
  // --- ユーザー登録ページ ---
  register: {
    onEnter() {
      this.currentStep = 1;
      this.renderStep(1);
    },
    
    currentStep: 1,
    
    renderStep(step) {
      document.querySelectorAll('.register-step').forEach(el => {
        el.style.display = 'none';
      });
      const stepEl = document.getElementById(`register-step-${step}`);
      if (stepEl) stepEl.style.display = 'block';
      
      // ステップインジケーター更新
      document.querySelectorAll('.step').forEach((dot, idx) => {
        dot.className = 'step';
        if (idx < step - 1) dot.classList.add('done');
        else if (idx === step - 1) dot.classList.add('active');
      });
    },
    
    next() {
      if (this.currentStep < 2) {
        this.currentStep++;
        this.renderStep(this.currentStep);
      }
    },
    
    prev() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.renderStep(this.currentStep);
      }
    },
    
    async submit() {
      const form = document.getElementById('register-form');
      const data = {
        line_uid: AppState.user?.userId || 'dev_user',
        name: AppState.user?.displayName || 'ゲスト',
        gender: form.querySelector('[name="gender"]')?.value || '',
        grade: parseInt(form.querySelector('[name="grade"]')?.value) || 1,
        university: form.querySelector('[name="university"]')?.value || '浜松医科大学',
        club: form.querySelector('[name="club"]')?.value || '',
        desired_dept: form.querySelector('[name="desired_dept"]')?.value || '',
        avatar_url: AppState.user?.pictureUrl || '',
      };
      
      try {
        showLoading(true, 'register-form-area');
        const created = await ApiService.post('users', data);
        AppState.dbUser = created;
        AppState.isRegistered = true;
        
        // ローカルに保存
        localStorage.setItem('hugmeid_user_id', created.id);
        
        showToast('登録が完了しました！🎉', 'success');
        Router.navigate('home');
      } catch (err) {
        console.error(err);
        showToast('登録に失敗しました。もう一度お試しください。', 'error');
      } finally {
        showLoading(false, 'register-form-area');
      }
    },
  },
  
  // --- ホームページ ---
  home: {
    async onEnter() {
      this.renderUser();
      await this.loadData();
    },
    
    renderUser() {
      const user = AppState.dbUser;
      const lineUser = AppState.user;
      const name = user?.name || lineUser?.displayName || 'ゲスト';
      const grade = user?.grade;
      const university = user?.university || '';
      
      const greetingEl = document.getElementById('hero-greeting');
      if (greetingEl) {
        const hour = new Date().getHours();
        const greet = hour < 10 ? 'おはようございます' : hour < 17 ? 'こんにちは' : 'こんばんは';
        greetingEl.textContent = greet + '、';
      }
      
      const nameEl = document.getElementById('hero-name');
      if (nameEl) nameEl.textContent = name + ' さん';
      
      const subtitleEl = document.getElementById('hero-subtitle');
      if (subtitleEl) {
        if (grade && university) {
          subtitleEl.textContent = `${university} ${grade}年生`;
        } else {
          subtitleEl.textContent = 'Hugmeidへようこそ！';
        }
      }
    },
    
    async loadData() {
      try {
        // 求人最新3件 (ホーム表示用)
        const jobsData = await ApiService.get('jobs', { limit: 3 });
        AppState.jobs = jobsData.data || [];
        this.renderJobCards(AppState.jobs);
        
        // 記事全件をキャッシュ (最新3件をホーム表示)
        const articlesData = await ApiService.get('articles', { limit: 50 });
        AppState.articles = articlesData.data || [];
        this.renderArticleCards(AppState.articles.slice(0, 3));
      } catch (err) {
        console.error('[Home] データ読み込みエラー:', err);
      }
    },
    
    renderJobCards(jobs) {
      const container = document.getElementById('home-job-list');
      if (!container) return;
      
      if (!jobs.length) {
        container.innerHTML = `<div class="empty-state"><span class="empty-icon">💼</span><p class="empty-title">求人情報はありません</p></div>`;
        return;
      }
      
      container.innerHTML = jobs.map(job => renderJobCard(job)).join('');
    },
    
    renderArticleCards(articles) {
      const container = document.getElementById('home-article-list');
      if (!container) return;
      
      if (!articles.length) {
        container.innerHTML = `<div class="empty-state"><span class="empty-icon">📰</span><p class="empty-title">記事はありません</p></div>`;
        return;
      }
      
      container.innerHTML = `<div class="scroll-grid">${articles.map(a => renderArticleCard(a)).join('')}</div>`;
    },
  },
  
  // --- 求人一覧ページ ---
  jobs: {
    async onEnter() {
      AppState.jobFilter = 'all';
      AppState.searchQuery = '';
      
      // 検索バーをリセット
      const searchInput = document.getElementById('jobs-search-input');
      if (searchInput) searchInput.value = '';
      
      await this.loadJobs();
    },
    
    async loadJobs() {
      showLoading(true, 'jobs-list-container');
      try {
        const data = await ApiService.get('jobs', { limit: 100 });
        AppState.jobs = data.data || [];
        this.renderFiltered();
      } catch (err) {
        console.error(err);
        showToast('求人の読み込みに失敗しました', 'error');
      } finally {
        showLoading(false, 'jobs-list-container');
      }
    },
    
    renderFiltered() {
      const filter = AppState.jobFilter;
      const query = AppState.searchQuery.toLowerCase();
      
      let filtered = AppState.jobs.filter(j => j.is_published);
      
      if (filter !== 'all') {
        filtered = filtered.filter(j => j.category === filter);
      }
      
      if (query) {
        filtered = filtered.filter(j =>
          j.title?.toLowerCase().includes(query) ||
          j.company_name?.toLowerCase().includes(query) ||
          j.category?.toLowerCase().includes(query)
        );
      }
      
      const container = document.getElementById('jobs-list-container');
      if (!container) return;
      
      const countEl = document.getElementById('jobs-count');
      if (countEl) countEl.textContent = `${filtered.length}件`;
      
      if (!filtered.length) {
        container.innerHTML = `
          <div class="empty-state">
            <span class="empty-icon">🔍</span>
            <p class="empty-title">該当する求人が見つかりません</p>
            <p class="empty-desc">フィルターや検索条件を変えてみてください</p>
          </div>`;
        return;
      }
      
      container.innerHTML = filtered.map(job => renderJobCard(job)).join('');
    },
    
    setFilter(category) {
      AppState.jobFilter = category;
      document.querySelectorAll('#jobs-filter-tabs .filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
      });
      this.renderFiltered();
    },
    
    search(query) {
      AppState.searchQuery = query;
      this.renderFiltered();
    },
  },
  
  // --- 求人詳細ページ ---
  'job-detail': {
    onEnter(job) {
      document.getElementById('bottom-nav').style.display = '';
      if (!job && AppState.selectedJob) job = AppState.selectedJob;
      if (!job) { Router.navigate('jobs'); return; }
      AppState.selectedJob = job;
      this.render(job);
    },
    
    render(job) {
      const catInfo = JOB_CATEGORY_LABELS[job.category] || { emoji: '💼', color: 'badge-gray' };
      const locInfo = LOCATION_TYPE_LABELS[job.location_type] || { label: job.location_type, cls: 'offline', icon: '📍' };
      
      const isBookmarked = AppState.bookmarks.some(b => b.job_id === job.id || b.job_id === job.id);
      
      const el = document.getElementById('page-job-detail');
      if (!el) return;
      
      el.querySelector('#job-detail-title').textContent = job.title;
      el.querySelector('#job-detail-company').textContent = job.company_name;
      
      const metaEl = el.querySelector('#job-detail-meta');
      if (metaEl) {
        metaEl.innerHTML = `
          <span class="badge ${catInfo.color}">${catInfo.emoji} ${job.category}</span>
          <span class="location-badge ${locInfo.cls}">${locInfo.icon} ${locInfo.label}</span>
        `;
      }
      
      el.querySelector('#job-detail-salary').textContent = job.salary || '要相談';
      el.querySelector('#job-detail-description').textContent = job.description || '';
      
      const bookmarkBtn = el.querySelector('#job-detail-bookmark-btn');
      if (bookmarkBtn) {
        bookmarkBtn.innerHTML = isBookmarked ? '⭐ ブックマーク済み' : '☆ ブックマーク';
        bookmarkBtn.classList.toggle('btn-primary', isBookmarked);
        bookmarkBtn.classList.toggle('btn-outline', !isBookmarked);
      }
      
      const applyBtn = el.querySelector('#job-detail-apply-btn');
      if (applyBtn && job.apply_url && job.apply_url !== '#') {
        applyBtn.href = job.apply_url;
        applyBtn.style.display = '';
      }
    },
    
    async toggleBookmark(job) {
      if (!AppState.isLoggedIn) {
        showToast('ブックマークにはLINEログインが必要です', 'error');
        return;
      }
      
      const userId = AppState.dbUser?.id;
      if (!userId) return;
      
      const existing = AppState.bookmarks.find(b => b.job_id === job.id);
      
      if (existing) {
        // 削除
        await ApiService.delete('bookmarks', existing.id);
        AppState.bookmarks = AppState.bookmarks.filter(b => b.id !== existing.id);
        showToast('ブックマークを解除しました');
      } else {
        // 追加
        const bm = await ApiService.post('bookmarks', { user_id: userId, job_id: job.id });
        AppState.bookmarks.push(bm);
        showToast('ブックマークに追加しました ⭐', 'success');
      }
      
      this.render(job);
    },
  },
  
  // --- 学校生活ページ ---
  school: {
    async onEnter() {
      await this.loadArticles();
    },
    
    async loadArticles() {
      showLoading(true, 'school-articles-container');
      try {
        const data = await ApiService.get('articles', { limit: 50 });
        const articles = (data.data || []).filter(a => a.section === 'school' && a.is_published);
        AppState.articles = data.data || [];
        this.render(articles);
      } catch (err) {
        console.error(err);
      } finally {
        showLoading(false, 'school-articles-container');
      }
    },
    
    render(articles) {
      const container = document.getElementById('school-articles-container');
      if (!container) return;
      
      if (!articles.length) {
        container.innerHTML = `<div class="empty-state"><span class="empty-icon">📚</span><p class="empty-title">記事はありません</p></div>`;
        return;
      }
      
      container.innerHTML = `<div class="scroll-grid">${articles.map(a => renderArticleCard(a)).join('')}</div>`;
    },
  },
  
  // --- 課外活動ページ ---
  extracurricular: {
    async onEnter() {
      await Promise.all([this.loadArticles(), this.loadOrgs()]);
    },
    
    async loadArticles() {
      try {
        const data = await ApiService.get('articles', { limit: 50 });
        const articles = (data.data || []).filter(a => a.section === 'extracurricular' && a.is_published);
        this.renderArticles(articles);
      } catch (err) { console.error(err); }
    },
    
    async loadOrgs() {
      showLoading(true, 'extra-orgs-container');
      try {
        const data = await ApiService.get('organizations', { limit: 50 });
        const orgs = (data.data || []).filter(o => o.is_published);
        AppState.organizations = data.data || [];
        this.renderOrgs(orgs);
      } catch (err) { console.error(err); }
      finally { showLoading(false, 'extra-orgs-container'); }
    },
    
    renderArticles(articles) {
      const container = document.getElementById('extra-articles-container');
      if (!container) return;
      if (!articles.length) {
        container.innerHTML = `<div class="empty-state"><span class="empty-icon">📝</span><p class="empty-title">記事はありません</p></div>`;
        return;
      }
      container.innerHTML = `<div class="scroll-grid">${articles.map(a => renderArticleCard(a)).join('')}</div>`;
    },
    
    renderOrgs(orgs) {
      const container = document.getElementById('extra-orgs-container');
      if (!container) return;
      if (!orgs.length) {
        container.innerHTML = `<div class="empty-state"><span class="empty-icon">🏛️</span><p class="empty-title">団体情報はありません</p></div>`;
        return;
      }
      container.innerHTML = orgs.map(org => renderOrgCard(org)).join('');
    },
  },
  
  // --- コネクションページ ---
  connections: {
    onEnter() {},
  },
  
  // --- マイページ ---
  mypage: {
    async onEnter() {
      this.render();
      await this.loadBookmarks();
    },
    
    render() {
      const user = AppState.dbUser;
      const lineUser = AppState.user;
      
      // アバター
      const avatarEl = document.getElementById('mypage-avatar');
      if (avatarEl) {
        const avatarUrl = user?.avatar_url || lineUser?.pictureUrl;
        if (avatarUrl) {
          avatarEl.innerHTML = `<img src="${escHtml(avatarUrl)}" alt="アバター" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        } else {
          const initial = (user?.name || lineUser?.displayName || 'G').charAt(0);
          avatarEl.innerHTML = initial;
        }
      }
      
      const nameEl = document.getElementById('mypage-name');
      if (nameEl) nameEl.textContent = user?.name || lineUser?.displayName || 'ゲスト';
      
      const metaEl = document.getElementById('mypage-meta');
      if (metaEl) {
        if (user) {
          const parts = [];
          if (user.university) parts.push(user.university);
          if (user.grade) parts.push(`${user.grade}年生`);
          metaEl.textContent = parts.join(' ') || '未設定';
        } else {
          metaEl.textContent = 'プロフィール未登録';
        }
      }
      
      // プロフィール詳細
      if (user) {
        this.renderProfileDetail(user);
      }
    },
    
    renderProfileDetail(user) {
      const el = document.getElementById('mypage-profile-detail');
      if (!el) return;
      
      const grade_labels = ['', '1年生', '2年生', '3年生', '4年生', '5年生', '6年生'];
      const gender_labels = { male: '男性', female: '女性', other: 'その他' };
      
      el.innerHTML = `
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">大学</span>
            <span class="info-value">${escHtml(user.university || '未設定')}</span>
          </div>
          <div class="info-item">
            <span class="info-label">学年</span>
            <span class="info-value">${grade_labels[user.grade] || '未設定'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">性別</span>
            <span class="info-value">${gender_labels[user.gender] || '未設定'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">部活・サークル</span>
            <span class="info-value">${escHtml(user.club || '未設定')}</span>
          </div>
          <div class="info-item">
            <span class="info-label">希望診療科</span>
            <span class="info-value">${escHtml(user.desired_dept || '未設定')}</span>
          </div>
        </div>
      `;
    },
    
    async loadBookmarks() {
      if (!AppState.dbUser) return;
      
      try {
        const bms = await ApiService.getUserBookmarks(AppState.dbUser.id);
        AppState.bookmarks = bms;
        this.renderBookmarkCount(bms.length);
      } catch (err) { console.error(err); }
    },
    
    renderBookmarkCount(count) {
      const el = document.getElementById('mypage-bookmark-count');
      if (el) el.textContent = count;
    },
  },
  
  // --- ブックマーク一覧 ---
  bookmarks: {
    async onEnter() {
      await this.loadBookmarks();
    },
    
    async loadBookmarks() {
      if (!AppState.dbUser) {
        document.getElementById('bookmarks-container').innerHTML = `
          <div class="empty-state">
            <span class="empty-icon">🔐</span>
            <p class="empty-title">ログインが必要です</p>
            <p class="empty-desc">ブックマーク機能を使うにはLINEログインが必要です</p>
          </div>`;
        return;
      }
      
      showLoading(true, 'bookmarks-container');
      try {
        const bms = await ApiService.getUserBookmarks(AppState.dbUser.id);
        AppState.bookmarks = bms;
        
        // ジョブ詳細をjobsキャッシュから取得
        const jobIds = bms.map(b => b.job_id);
        const bookmarkedJobs = AppState.jobs.filter(j => jobIds.includes(j.id));
        
        // キャッシュにないジョブは別途取得
        const missingIds = jobIds.filter(id => !bookmarkedJobs.find(j => j.id === id));
        for (const jid of missingIds) {
          try {
            const job = await ApiService.getById('jobs', jid);
            if (job) bookmarkedJobs.push(job);
          } catch {}
        }
        
        this.render(bookmarkedJobs);
      } catch (err) {
        console.error(err);
        showToast('ブックマークの読み込みに失敗しました', 'error');
      } finally {
        showLoading(false, 'bookmarks-container');
      }
    },
    
    render(jobs) {
      const container = document.getElementById('bookmarks-container');
      if (!container) return;
      
      if (!jobs.length) {
        container.innerHTML = `
          <div class="empty-state">
            <span class="empty-icon">⭐</span>
            <p class="empty-title">ブックマークはありません</p>
            <p class="empty-desc">気になる求人をブックマークしておくと、ここで確認できます</p>
            <button class="btn btn-primary btn-sm mt-md" onclick="Router.navigate('jobs')">求人を探す</button>
          </div>`;
        return;
      }
      
      container.innerHTML = jobs.map(job => renderJobCard(job)).join('');
    },
  },
  
  // --- 記事詳細ページ ---
  'article-detail': {
    onEnter(article) {
      if (!article && AppState.selectedArticle) article = AppState.selectedArticle;
      if (!article) { Router.navigate('home'); return; }
      AppState.selectedArticle = article;
      this.render(article);
    },
    
    render(article) {
      const catInfo = ARTICLE_CATEGORY_LABELS[article.category] || { emoji: '📝', color: 'badge-gray' };
      
      const el = document.getElementById('page-article-detail');
      if (!el) return;
      
      const headerEl = el.querySelector('#article-detail-header');
      if (headerEl) {
        headerEl.innerHTML = `
          <div class="detail-header">
            <div class="detail-meta">
              <span class="badge ${catInfo.color}">${catInfo.emoji} ${article.category}</span>
              <span class="badge badge-gray">${article.section === 'school' ? '🎓 学校生活' : '🌟 課外活動'}</span>
            </div>
            <h1 class="detail-title">${escHtml(article.title)}</h1>
          </div>
        `;
      }
      
      const imgEl = el.querySelector('#article-detail-img');
      if (imgEl) {
        if (article.thumbnail_url) {
          imgEl.innerHTML = `<img src="${escHtml(article.thumbnail_url)}" alt="${escHtml(article.title)}" style="width:100%;max-height:240px;object-fit:cover;">`;
        } else {
          imgEl.innerHTML = `<div style="width:100%;height:160px;background:linear-gradient(135deg,#d0f2e0,#06C755);display:flex;align-items:center;justify-content:center;font-size:3rem;">${catInfo.emoji}</div>`;
        }
      }
      
      const contentEl = el.querySelector('#article-detail-content');
      if (contentEl) {
        contentEl.innerHTML = `<p style="font-size:0.95rem;line-height:1.8;color:var(--color-text-secondary);padding:var(--spacing-lg) var(--spacing-md);">${escHtml(article.content || '')}</p>`;
      }
    },
  },
};

// ============================================================
// レンダリングヘルパー
// ============================================================

function renderJobCard(job) {
  const catInfo = JOB_CATEGORY_LABELS[job.category] || { emoji: '💼', color: 'badge-gray' };
  const locInfo = LOCATION_TYPE_LABELS[job.location_type] || { label: job.location_type, cls: 'offline', icon: '📍' };
  const isBookmarked = AppState.bookmarks.some(b => b.job_id === job.id);
  
  return `
    <div class="job-card" onclick="openJobDetail('${escHtml(job.id)}')">
      <div class="job-card-header">
        <div class="job-company-logo">${catInfo.emoji}</div>
        <div class="job-card-info">
          <div class="job-card-title">${escHtml(job.title)}</div>
          <div class="job-card-company">${escHtml(job.company_name)}</div>
        </div>
        <button class="job-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}"
          onclick="event.stopPropagation(); toggleJobBookmark('${escHtml(job.id)}')"
          title="${isBookmarked ? 'ブックマーク解除' : 'ブックマーク追加'}">
          ${isBookmarked ? '⭐' : '☆'}
        </button>
      </div>
      <div class="job-card-meta">
        <span class="badge ${catInfo.color}">${catInfo.emoji} ${escHtml(job.category)}</span>
        <span class="location-badge ${locInfo.cls}">${locInfo.icon} ${escHtml(locInfo.label)}</span>
        <span class="job-salary">${escHtml(job.salary || '')}</span>
      </div>
    </div>
  `;
}

function renderArticleCard(article) {
  const catInfo = ARTICLE_CATEGORY_LABELS[article.category] || { emoji: '📝', color: 'badge-gray' };
  return `
    <div class="article-card" onclick="openArticleDetail('${escHtml(article.id)}')">
      ${article.thumbnail_url
        ? `<img class="article-card-img" src="${escHtml(article.thumbnail_url)}" alt="${escHtml(article.title)}" loading="lazy">`
        : `<div class="article-card-img-placeholder">${catInfo.emoji}</div>`
      }
      <div class="article-card-body">
        <span class="badge ${catInfo.color}" style="margin-bottom:6px">${catInfo.emoji} ${escHtml(article.category)}</span>
        <div class="article-card-title">${escHtml(article.title)}</div>
      </div>
    </div>
  `;
}

function renderOrgCard(org) {
  const emojis = ['🏛️', '🔬', '💪', '🎓', '🌍', '🎵', '⚽'];
  const emoji = emojis[org.name?.charCodeAt(0) % emojis.length] || '🏛️';
  return `
    <div class="org-card" onclick="openOrgDetail('${escHtml(org.id)}')">
      <div class="org-logo">${emoji}</div>
      <div class="org-info">
        <div class="org-name">${escHtml(org.name)}</div>
        <div class="org-desc">${escHtml(org.description || '')}</div>
      </div>
      <span style="color:var(--color-text-muted);font-size:0.9rem;">›</span>
    </div>
  `;
}

// ============================================================
// グローバルイベントハンドラ
// ============================================================

function openJobDetail(jobId) {
  const job = AppState.jobs.find(j => j.id === jobId);
  if (job) {
    AppState.selectedJob = job;
    Router.navigate('job-detail', { data: job });
  }
}

function openArticleDetail(articleId) {
  // AppState.articlesは全データを保持
  const article = AppState.articles.find(a => a.id === articleId);
  
  if (article) {
    AppState.selectedArticle = article;
    Router.navigate('article-detail', { data: article });
    return;
  }
  
  // キャッシュにない場合はDBから取得
  ApiService.getById('articles', articleId).then(a => {
    if (a) {
      AppState.selectedArticle = a;
      Router.navigate('article-detail', { data: a });
    }
  }).catch(err => {
    console.error('[Article] 取得エラー:', err);
    showToast('記事の読み込みに失敗しました', 'error');
  });
}

function openOrgDetail(orgId) {
  const org = AppState.organizations.find(o => o.id === orgId);
  if (!org) return;
  AppState.selectedOrg = org;
  
  // 簡易モーダルで表示
  showOrgModal(org);
}

function showOrgModal(org) {
  const emojis = ['🏛️', '🔬', '💪', '🎓', '🌍', '🎵', '⚽'];
  const emoji = emojis[org.name?.charCodeAt(0) % emojis.length] || '🏛️';
  
  const overlay = document.getElementById('org-modal-overlay');
  const content = document.getElementById('org-modal-content');
  if (!overlay || !content) return;
  
  content.innerHTML = `
    <div class="modal-header">
      <span class="modal-close" onclick="closeOrgModal()">✕</span>
      <div class="modal-title">団体詳細</div>
    </div>
    <div class="modal-body">
      <div style="text-align:center;margin-bottom:var(--spacing-md)">
        <div class="avatar avatar-lg" style="margin:0 auto;font-size:2rem;">${emoji}</div>
        <h2 style="font-size:1.1rem;font-weight:700;margin-top:var(--spacing-sm)">${escHtml(org.name)}</h2>
      </div>
      <div class="divider"></div>
      <p style="font-size:0.9rem;line-height:1.7;color:var(--color-text-secondary);margin-bottom:var(--spacing-md)">${escHtml(org.description || '')}</p>
      <div class="info-list">
        ${org.contact ? `<div class="info-item"><span class="info-label">連絡先</span><span class="info-value">${escHtml(org.contact)}</span></div>` : ''}
        ${org.sns_url ? `<div class="info-item"><span class="info-label">SNS</span><span class="info-value"><a href="${escHtml(org.sns_url)}" target="_blank" style="color:var(--color-primary)">${escHtml(org.sns_url)}</a></span></div>` : ''}
      </div>
    </div>
  `;
  
  overlay.classList.add('active');
}

function closeOrgModal() {
  document.getElementById('org-modal-overlay')?.classList.remove('active');
}

async function toggleJobBookmark(jobId) {
  if (!AppState.isLoggedIn || !AppState.dbUser) {
    showToast('ブックマークにはLINEログインが必要です', 'error');
    return;
  }
  
  const job = AppState.jobs.find(j => j.id === jobId);
  if (!job) return;
  
  const userId = AppState.dbUser.id;
  const existing = AppState.bookmarks.find(b => b.job_id === jobId);
  
  try {
    if (existing) {
      await ApiService.delete('bookmarks', existing.id);
      AppState.bookmarks = AppState.bookmarks.filter(b => b.id !== existing.id);
      showToast('ブックマークを解除しました');
    } else {
      const bm = await ApiService.post('bookmarks', { user_id: userId, job_id: jobId });
      AppState.bookmarks.push(bm);
      showToast('ブックマークに追加しました ⭐', 'success');
    }
    
    // 求人一覧を再レンダリング
    const currentPage = AppState.currentPage;
    if (currentPage === 'jobs') {
      PageControllers.jobs.renderFiltered();
    } else if (currentPage === 'home') {
      PageControllers.home.renderJobCards(AppState.jobs);
    } else if (currentPage === 'job-detail' && AppState.selectedJob) {
      PageControllers['job-detail'].render(AppState.selectedJob);
    } else if (currentPage === 'bookmarks') {
      PageControllers.bookmarks.loadBookmarks();
    }
  } catch (err) {
    console.error(err);
    showToast('エラーが発生しました', 'error');
  }
}

// ============================================================
// UI ユーティリティ
// ============================================================

function showLoading(show, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  
  if (show) {
    el.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span>読み込み中...</span>
      </div>`;
  }
}

function showToast(message, type = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}

function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// プロフィール編集モーダル
function openProfileEditModal() {
  const user = AppState.dbUser;
  if (!user) return;
  
  const overlay = document.getElementById('profile-edit-modal');
  if (!overlay) return;
  
  // フォームに現在値をセット
  overlay.querySelector('[name="edit-university"]').value = user.university || '';
  overlay.querySelector('[name="edit-grade"]').value = user.grade || '';
  overlay.querySelector('[name="edit-gender"]').value = user.gender || '';
  overlay.querySelector('[name="edit-club"]').value = user.club || '';
  overlay.querySelector('[name="edit-desired_dept"]').value = user.desired_dept || '';
  
  overlay.classList.add('active');
}

function closeProfileEditModal() {
  document.getElementById('profile-edit-modal')?.classList.remove('active');
}

async function saveProfile() {
  const overlay = document.getElementById('profile-edit-modal');
  if (!overlay || !AppState.dbUser) return;
  
  const data = {
    university: overlay.querySelector('[name="edit-university"]')?.value || '',
    grade: parseInt(overlay.querySelector('[name="edit-grade"]')?.value) || 1,
    gender: overlay.querySelector('[name="edit-gender"]')?.value || '',
    club: overlay.querySelector('[name="edit-club"]')?.value || '',
    desired_dept: overlay.querySelector('[name="edit-desired_dept"]')?.value || '',
  };
  
  try {
    const updated = await ApiService.patch('users', AppState.dbUser.id, data);
    AppState.dbUser = { ...AppState.dbUser, ...updated };
    localStorage.setItem('hugmeid_user_id', AppState.dbUser.id);
    
    showToast('プロフィールを更新しました ✓', 'success');
    closeProfileEditModal();
    PageControllers.mypage.render();
  } catch (err) {
    console.error(err);
    showToast('更新に失敗しました', 'error');
  }
}

// ============================================================
// 認証フロー
// ============================================================

async function initAuth() {
  // LIFF初期化
  await LiffService.init();
  
  const isLoggedIn = LiffService.isLoggedIn();
  AppState.isLoggedIn = isLoggedIn;
  
  if (!isLoggedIn) {
    // 未ログイン → ログイン画面
    Router.navigate('login', { init: false });
    return;
  }
  
  // プロフィール取得
  try {
    AppState.user = await LiffService.getProfile();
  } catch (err) {
    console.error('[Auth] プロフィール取得エラー:', err);
  }
  
  // DBユーザー検索
  const lineUid = AppState.user?.userId;
  if (lineUid) {
    try {
      // ローカルストレージにIDがあれば直接取得
      const savedId = localStorage.getItem('hugmeid_user_id');
      if (savedId) {
        try {
          AppState.dbUser = await ApiService.getById('users', savedId);
          AppState.isRegistered = true;
        } catch {
          AppState.dbUser = await ApiService.findUserByLineUid(lineUid);
          if (AppState.dbUser) {
            AppState.isRegistered = true;
            localStorage.setItem('hugmeid_user_id', AppState.dbUser.id);
          }
        }
      } else {
        AppState.dbUser = await ApiService.findUserByLineUid(lineUid);
        if (AppState.dbUser) {
          AppState.isRegistered = true;
          localStorage.setItem('hugmeid_user_id', AppState.dbUser.id);
        }
      }
    } catch (err) {
      console.error('[Auth] ユーザー取得エラー:', err);
    }
  }
  
  if (!AppState.isRegistered) {
    // 未登録 → 登録画面
    Router.navigate('register', { init: false });
    PageControllers.register.onEnter();
    return;
  }
  
<<<<<<< HEAD
=======
  // Supabaseサインイン (マイページ用)
  if (AppState.user) {
    await SupabaseService.signInWithLine(AppState.user);
  }
  
>>>>>>> c25eb19 (feat: マイページをWebアプリ化し、Supabase統合)
  // ブックマーク取得
  if (AppState.dbUser) {
    try {
      AppState.bookmarks = await ApiService.getUserBookmarks(AppState.dbUser.id);
    } catch {}
  }
  
  // ホームへ
  Router.navigate('home');
}

// LINEログインボタン
async function handleLineLogin() {
  const btn = document.getElementById('line-login-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div> ログイン中...`;
  }
  
  LiffService.login();
  
  // 開発モードでは即座に認証フローを実行
  if (APP_CONFIG.isDev) {
    setTimeout(() => initAuth(), 500);
  }
}

// ログアウト
function handleLogout() {
  if (!confirm('ログアウトしますか？')) return;
  
  LiffService.logout();
  localStorage.removeItem('hugmeid_user_id');
  AppState.user = null;
  AppState.dbUser = null;
  AppState.isLoggedIn = false;
  AppState.isRegistered = false;
  AppState.bookmarks = [];
  
  Router.navigate('login', { init: false });
  showToast('ログアウトしました');
}

// 登録スキップ (開発・デモ用)
async function skipRegisterForDemo() {
  // デモ用: ログインユーザーのまま未登録でホームに飛ぶ
  Router.navigate('home');
}

// ============================================================
// アプリ初期化
// ============================================================

async function initApp() {
  console.log(`🚀 ${APP_CONFIG.appName} v${APP_CONFIG.version} 起動`);
  
<<<<<<< HEAD
=======
  // Supabase初期化
  SupabaseService.init();
  
>>>>>>> c25eb19 (feat: マイページをWebアプリ化し、Supabase統合)
  // イベントリスナー設定
  setupEventListeners();
  
  // 認証フロー開始
  await initAuth();
}

function setupEventListeners() {
  // ボトムナビ
  document.getElementById('nav-home')?.addEventListener('click', () => Router.navigate('home'));
  document.getElementById('nav-jobs')?.addEventListener('click', () => Router.navigate('jobs'));
  document.getElementById('nav-school')?.addEventListener('click', () => Router.navigate('school'));
  document.getElementById('nav-extra')?.addEventListener('click', () => Router.navigate('extracurricular'));
  document.getElementById('nav-connections')?.addEventListener('click', () => Router.navigate('connections'));
<<<<<<< HEAD
  document.getElementById('nav-mypage')?.addEventListener('click', () => Router.navigate('mypage'));
=======
  document.getElementById('nav-mypage')?.addEventListener('click', () => {
    // マイページをWebアプリとして開く
    window.open('mypage.html', '_blank');
  });
>>>>>>> c25eb19 (feat: マイページをWebアプリ化し、Supabase統合)
  
  // 求人検索
  document.getElementById('jobs-search-input')?.addEventListener('input', (e) => {
    PageControllers.jobs.search(e.target.value);
  });
  
  // 求人フィルタータブ
  document.getElementById('jobs-filter-tabs')?.addEventListener('click', (e) => {
    const tab = e.target.closest('.filter-tab');
    if (tab) PageControllers.jobs.setFilter(tab.dataset.category);
  });
  
  // プロフィール編集保存
  document.getElementById('save-profile-btn')?.addEventListener('click', saveProfile);
  
  // FAQ アコーディオン
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      q.closest('.faq-item')?.classList.toggle('open');
    });
  });
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', initApp);
