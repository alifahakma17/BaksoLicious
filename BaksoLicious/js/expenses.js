function fmt(v){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(v)}
document.addEventListener('DOMContentLoaded',()=>{
  const nameEl=document.getElementById('expenseName'); 
  const priceEl=document.getElementById('unitPrice'); 
  const qtyEl=document.getElementById('expenseQty');
  const totalEl=document.getElementById('totalExpense'); 
  const tableBody=document.querySelector('#expensesTable tbody'); 
  const search=document.getElementById('searchExpenses');
  const categorySelect=document.getElementById('expenseCategory');
  const customCategoryInput=document.getElementById('customCategory');
  const unitSelect=document.getElementById('expenseUnit');
  const customUnitInput=document.getElementById('customUnit');

  // Toggle custom category input
  categorySelect.addEventListener('change',()=>{
    if(categorySelect.value==='Lainnya') {
      customCategoryInput.style.display='block';
      customCategoryInput.focus();
    } else {
      customCategoryInput.style.display='none';
    }
  });

  // Toggle custom unit input
  unitSelect.addEventListener('change',()=>{
    if(unitSelect.value==='Lainnya') {
      customUnitInput.style.display='block';
      customUnitInput.focus();
    } else {
      customUnitInput.style.display='none';
    }
  });

  function update(){ totalEl.textContent = fmt(Number(priceEl.value||0)*Number(qtyEl.value||0)); }
  priceEl.addEventListener('input',update); qtyEl.addEventListener('input',update);

  function load(){ const data=JSON.parse(localStorage.getItem('bl_expenses')||'[]'); render(data); }
  function render(data){ tableBody.innerHTML=''; let sum=0; data.forEach((r,i)=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${i+1}</td><td>${r.name}</td><td>${r.category}</td><td>${r.qty} ${r.unit}</td><td>${fmt(r.unitPrice)}</td><td>${fmt(r.total)}</td><td><button data-i="${i}" class="del">Hapus</button></td>`; tableBody.appendChild(tr); sum+=Number(r.total); }); document.getElementById('expenseTotal').textContent=fmt(sum); }

  document.getElementById('saveExpense').addEventListener('click',()=>{
    if(window.showLoading) showLoading();
    setTimeout(()=>{
      const data=JSON.parse(localStorage.getItem('bl_expenses')||'[]');
      const name=nameEl.value||'Item'; 
      let category=categorySelect.value;
      if(category==='Lainnya') category=customCategoryInput.value||'Lainnya';
      const unitPrice=Number(priceEl.value||0); 
      const qty=Number(qtyEl.value||1); 
      let unit=unitSelect.value;
      if(unit==='Lainnya') unit=customUnitInput.value||'Lainnya';
      const total=unitPrice*qty;
      if(!name || !unitPrice) {
        alert('Mohon isi nama item dan harga unit');
        if(window.hideLoading) hideLoading();
        return;
      }
      data.unshift({date:document.getElementById('expenseDate').value||new Date().toISOString().slice(0,10),name,category,unitPrice,qty,unit,total});
      localStorage.setItem('bl_expenses',JSON.stringify(data)); 
      load(); 
      nameEl.value=''; priceEl.value=''; qtyEl.value='1'; categorySelect.value='Bahan Baku'; customCategoryInput.value=''; customCategoryInput.style.display='none'; unitSelect.value='Kg'; customUnitInput.value=''; customUnitInput.style.display='none';
      if(window.hideLoading) hideLoading(); 
      if(window.Swal) Swal.fire('Disimpan','Pengeluaran berhasil disimpan','success'); else alert('Pengeluaran berhasil disimpan');
    },600);
  });

  tableBody.addEventListener('click',e=>{ if(e.target.classList.contains('del')){ const i=e.target.dataset.i; const data=JSON.parse(localStorage.getItem('bl_expenses')||'[]'); data.splice(i,1); localStorage.setItem('bl_expenses',JSON.stringify(data)); load(); } });

  search.addEventListener('input',()=>{ const q=search.value.toLowerCase(); const data=JSON.parse(localStorage.getItem('bl_expenses')||'[]'); render(data.filter(r=>r.name.toLowerCase().includes(q))); });

  load(); update();
});
