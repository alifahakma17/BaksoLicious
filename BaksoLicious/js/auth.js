// Autentikasi sederhana menggunakan localStorage
(function(){
  const defaultUser = {email:'owner@bakso.com',password:'password'};
  if(!localStorage.getItem('bl_users')) localStorage.setItem('bl_users',JSON.stringify([defaultUser]));

  function $(s){return document.querySelector(s)}
  const loginForm = $('#loginForm');
  if(loginForm){
    $('#togglePwd').addEventListener('click',e=>{
      const pwd=$('#password'); pwd.type = pwd.type==='password'?'text':'password';
    });
    loginForm.addEventListener('submit',e=>{
      e.preventDefault();
      const email=$('#email').value.trim(), pwd=$('#password').value;
      const users=JSON.parse(localStorage.getItem('bl_users')||'[]');
      const ok = users.find(u=>u.email===email && u.password===pwd);
      if(ok){
        localStorage.setItem('bl_session',JSON.stringify({email}));
        window.location='dashboard.html';
      } else {
        alert('Kredensial tidak valid. Gunakan owner@bakso.com / password');
      }
    });
  }

  // Penanganan logout
  const logout = document.getElementById('logout');
  if(logout) logout.addEventListener('click',e=>{ localStorage.removeItem('bl_session'); window.location='index.html'; });

  // protect pages
  if(!location.pathname.endsWith('index.html')){
    const sess = localStorage.getItem('bl_session');
    if(!sess){ window.location='index.html'; }
  }

  // add mobile hamburger and loading overlay
  if(document.querySelector('.content')){
    const btn = document.createElement('button'); btn.className='hamburger'; btn.innerHTML='☰';
    btn.style.cssText='position:fixed;top:12px;left:12px;z-index:9999;padding:8px;border-radius:8px;background:var(--peach);border:none';
    document.body.appendChild(btn);
    btn.addEventListener('click',()=>{ document.querySelector('.sidebar').classList.toggle('open'); });

    // loading overlay
    const overlay = document.createElement('div'); overlay.id='blLoading'; overlay.style.cssText='position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.2);z-index:9998';
    overlay.innerHTML = '<div style="background:white;padding:20px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.15)"><div class="spinner" style="width:36px;height:36px;border:4px solid #eee;border-top-color:var(--peach);border-radius:50%;animation:spin 1s linear infinite"></div></div>';
    document.body.appendChild(overlay);
    window.showLoading = ()=>overlay.style.display='flex'; window.hideLoading=()=>overlay.style.display='none';
    const style = document.createElement('style'); style.innerHTML='@keyframes spin{to{transform:rotate(360deg)}}'; document.head.appendChild(style);
  }
})();
