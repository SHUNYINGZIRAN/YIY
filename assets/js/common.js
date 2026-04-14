/**
 * 云间小阁 - 公共登录状态管理
 * 统一处理所有页面的登录状态同步
 */

// 登录按钮元素ID
const LOGIN_BTN_ID = 'loginBtn';

/**
 * 获取当前登录用户
 */
function getCurrentUser() {
    return sessionStorage.getItem('yunji_current_user');
}

/**
 * 更新登录按钮状态
 * @param {string} targetBtnId - 登录按钮的ID
 */
function updateLoginBtn(targetBtnId) {
    const btnId = targetBtnId || LOGIN_BTN_ID;
    const loginBtn = document.getElementById(btnId);
    if (!loginBtn) return;
    
    const currentUser = getCurrentUser();
    if (currentUser) {
        // 已登录：显示昵称
        loginBtn.textContent = currentUser;
        loginBtn.style.background = '#8c6d46';
        loginBtn.style.color = '#fff';
        loginBtn.title = '点击进入个人中心';
    } else {
        // 未登录：显示登录/注册
        loginBtn.textContent = '登录 / 注册';
        loginBtn.style.background = 'transparent';
        loginBtn.style.color = '#5c4c3e';
        loginBtn.title = '';
    }
}

/**
 * 初始化登录按钮点击事件
 * @param {string} targetBtnId - 登录按钮的ID
 * @param {string} personalPagePath - 个人中心页面路径
 * @param {string} loginPagePath - 登录页面路径
 */
function initLoginBtn(targetBtnId, personalPagePath, loginPagePath) {
    const btnId = targetBtnId || LOGIN_BTN_ID;
    const personalPath = personalPagePath || '个人资料/个人中心.html';
    const loginPath = loginPagePath || '登录and注册/登录页面.html';
    
    const loginBtn = document.getElementById(btnId);
    if (!loginBtn) return;
    
    // 更新按钮状态
    updateLoginBtn(btnId);
    
    // 绑定点击事件
    loginBtn.addEventListener('click', () => {
        const currentUser = getCurrentUser();
        
        if (currentUser) {
            // 已登录：跳转到个人中心
            window.location.href = personalPath;
        } else {
            // 未登录：设置来源页面并跳转登录页
            sessionStorage.setItem('previousPage', window.location.pathname.split('/').pop() || 'index.html');
            window.location.href = loginPath;
        }
    });
    
    // 监听 storage 变化（跨标签页同步）
    window.addEventListener('storage', (e) => {
        if (e.key === 'yunji_current_user' || e.key === 'justLoggedIn') {
            updateLoginBtn(btnId);
        }
    });
    
    // 监听页面可见性变化（从其他标签页返回时更新状态）
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            updateLoginBtn(btnId);
        }
    });
    
    // 检查是否有从登录页返回的登录成功标记
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
        sessionStorage.removeItem('justLoggedIn');
        updateLoginBtn(btnId);
    }
}

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否有登录成功标记
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
        sessionStorage.removeItem('justLoggedIn');
        updateLoginBtn(LOGIN_BTN_ID);
    } else {
        updateLoginBtn(LOGIN_BTN_ID);
    }
});
