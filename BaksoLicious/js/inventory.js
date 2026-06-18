document.addEventListener('DOMContentLoaded',()=>{
  const defaultInv = [
    {name:'Sayuran',unit:'Kg',stock:3},
    {name:'Daging Sapi',unit:'Kg',stock:0.5},
    {name:'Tahu',unit:'Papan',stock:5},
    {name:'Bakso',unit:'Buah',stock:12},
    {name:'Bumbu Kuah',unit:'Paket',stock:2},
    {name:'Wonton Goreng',unit:'Paket',stock:6},
    {name:'Sisa Daging Sapi',unit:'Kg',stock:2}
  ];
  if(!localStorage.getItem('bl_inventory')) localStorage.setItem('bl_inventory',JSON.stringify(defaultInv));

  const tbody=document.querySelector('#inventoryTable tbody'); const search=document.getElementById('searchInventory');

  function render(data){ tbody.innerHTML=''; data.forEach((it,i)=>{ const tr=document.createElement('tr'); const status = Number(it.stock)>2?`<span class="badge green">Aman</span>`:`<span class="badge red">Rendah</span>`; tr.innerHTML=`<td>${it.name}</td><td>${it.unit}</td><td>${it.stock}</td><td>${status}</td><td><button data-i="${i}" class="edit">Edit</button> <button data-i="${i}" class="del">Hapus</button></td>`; tbody.appendChild(tr); }); }

  function load(){ const inv=JSON.parse(localStorage.getItem('bl_inventory')||'[]'); render(inv); }

  tbody.addEventListener('click',e=>{
    const i=e.target.dataset.i; const inv=JSON.parse(localStorage.getItem('bl_inventory')||'[]');
    if(e.target.classList.contains('del')){
      if(window.showLoading) showLoading();
      setTimeout(()=>{
        inv.splice(i,1); localStorage.setItem('bl_inventory',JSON.stringify(inv)); load(); if(window.hideLoading) hideLoading(); if(window.Swal) Swal.fire('Dihapus','Item dihapus dari inventaris','success');
      },400);
    }
    if(e.target.classList.contains('edit')){
      const it = inv[i]; const name=prompt('Nama item',it.name); if(name===null) return; const unit=prompt('Unit',it.unit); const stock=prompt('Stok',it.stock);
        inv[i]={name,unit,stock:Number(stock)}; localStorage.setItem('bl_inventory',JSON.stringify(inv)); load(); if(window.Swal) Swal.fire('Disimpan','Item berhasil diperbarui','success');
    }
  });

  document.getElementById('addItemBtn').addEventListener('click',()=>{
    const name = prompt('Nama item'); if(!name) return; const unit = prompt('Unit','Kg'); const stock = prompt('Stok','0');
    if(window.showLoading) showLoading();
    setTimeout(()=>{
      const inv = JSON.parse(localStorage.getItem('bl_inventory')||'[]'); inv.unshift({name,unit,stock:Number(stock)}); localStorage.setItem('bl_inventory',JSON.stringify(inv)); load(); if(window.hideLoading) hideLoading(); if(window.Swal) Swal.fire('Disimpan','Item berhasil ditambahkan','success');
    },500);
  });

  search.addEventListener('input',()=>{ const q=search.value.toLowerCase(); const inv=JSON.parse(localStorage.getItem('bl_inventory')||'[]'); render(inv.filter(i=>i.name.toLowerCase().includes(q))); });

  load();
});
