const PRICES = {'Bakso Malang':42000,'Iced Tea':5000,'Mineral Water':3000};
function idr(v){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(v)}
document.addEventListener('DOMContentLoaded',()=>{
  const product = document.getElementById('productSelect');
  const pricePer = document.getElementById('pricePer');
  const qty = document.getElementById('quantity');
  const totalSale = document.getElementById('totalSale');
  const tableBody = document.querySelector('#salesTable tbody');
  const dailyTotal = document.getElementById('dailyTotal');
  const search = document.getElementById('searchSales');

  function updateTotal(){
    const price = Number(pricePer.value||0);
    totalSale.textContent = idr(price*Number(qty.value||0));
  }

  product.addEventListener('change',()=>{ 
    if(PRICES[product.value]) {
      pricePer.value = PRICES[product.value]; 
    }
    updateTotal();
  });
  
  product.addEventListener('input',()=>{ updateTotal(); });
  pricePer.addEventListener('input',updateTotal);
  qty.addEventListener('input',updateTotal);
  updateTotal();

  function load(){
    const data = JSON.parse(localStorage.getItem('bl_sales')||'[]');
    render(data);
  }
  function render(data){
    tableBody.innerHTML=''; let sum=0; data.forEach((r,i)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${i+1}</td><td>${r.product}</td><td>${r.qty}</td><td>${idr(r.price)}</td><td>${idr(r.total)}</td><td><button data-i="${i}" class="del">Hapus</button></td>`;
      tableBody.appendChild(tr); sum+=Number(r.total);
    });
    dailyTotal.textContent = idr(sum);
  }

  document.getElementById('saveSale').addEventListener('click',()=>{
    if(window.showLoading) showLoading();
    setTimeout(()=>{
      const data = JSON.parse(localStorage.getItem('bl_sales')||'[]');
      const p = product.value; const q = Number(qty.value); const price = Number(pricePer.value);
      if(!p || !price) {
        alert('Mohon isi produk dan harga');
        if(window.hideLoading) hideLoading();
        return;
      }
      const total=price*q;
      data.unshift({date:document.getElementById('saleDate').value || new Date().toISOString().slice(0,10),product:p,qty:q,price,total});
      localStorage.setItem('bl_sales',JSON.stringify(data)); load();
      product.value=''; pricePer.value=''; qty.value='1'; 
      if(window.hideLoading) hideLoading();
      if(window.Swal) Swal.fire('Disimpan','Penjualan berhasil disimpan','success'); else alert('Penjualan berhasil disimpan');
    },600);
  });

  tableBody.addEventListener('click',e=>{
    if(e.target.classList.contains('del')){
      const i = e.target.dataset.i; const data = JSON.parse(localStorage.getItem('bl_sales')||'[]'); data.splice(i,1); localStorage.setItem('bl_sales',JSON.stringify(data)); load();
    }
  });

  search.addEventListener('input',()=>{
    const q = search.value.toLowerCase(); const data = JSON.parse(localStorage.getItem('bl_sales')||'[]');
    render(data.filter(r=>r.product.toLowerCase().includes(q)));
  });

  load();
});
