function fmt(v){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(v)}
document.addEventListener('DOMContentLoaded',()=>{
  const sales = JSON.parse(localStorage.getItem('bl_sales')||'[]');
  const expenses = JSON.parse(localStorage.getItem('bl_expenses')||'[]');
  const totalS = sales.reduce((s,r)=>s+Number(r.total),0);
  const totalE = expenses.reduce((s,r)=>s+Number(r.total),0);
  document.getElementById('repSales').textContent = fmt(totalS);
  document.getElementById('repExpenses').textContent = fmt(totalE);
  document.getElementById('repProfit').textContent = fmt(totalS-totalE);

  // Bagan batang sederhana membandingkan jumlah harian (kelompokkan berdasarkan tanggal)
  const group = (arr)=>{ const m={}; arr.forEach(r=>{ const d=r.date||new Date().toISOString().slice(0,10); m[d]=(m[d]||0)+Number(r.total); }); return m };
  const sBy=group(sales); const eBy=group(expenses); const days = Array.from(new Set([...Object.keys(sBy),...Object.keys(eBy)])).sort();
  const sData = days.map(d=>sBy[d]||0), eData = days.map(d=>eBy[d]||0);
  const ctx = document.getElementById('barChart').getContext('2d');
  new Chart(ctx,{type:'bar',data:{labels:days, datasets:[{label:'Penjualan',data:sData,backgroundColor:'#7F66FF'},{label:'Pengeluaran',data:eData,backgroundColor:'#FFB58A'}]},options:{responsive:true}});

  const daysCount = Math.max(days.length,1);
  document.getElementById('avgSales').textContent = fmt(Math.round(totalS/daysCount));
  document.getElementById('avgExpenses').textContent = fmt(Math.round(totalE/daysCount));
  document.getElementById('avgProfit').textContent = fmt(Math.round((totalS-totalE)/daysCount));

  document.getElementById('downloadReport').addEventListener('click',async()=>{
    const { jsPDF } = window.jspdf; const doc = new jsPDF(); doc.text('Laporan Keuangan BaksoLicious',14,20); doc.text(`Total Penjualan: ${fmt(totalS)}`,14,36); doc.text(`Total Pengeluaran: ${fmt(totalE)}`,14,44); doc.text(`Keuntungan Bersih: ${fmt(totalS-totalE)}`,14,52); doc.save('laporan.pdf');
  });
});
