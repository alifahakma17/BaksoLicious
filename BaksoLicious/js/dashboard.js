function formatIDR(v){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(v)}
document.addEventListener('DOMContentLoaded',()=>{
  // sample data
  const salesData = [980000,1000000,1100000,1150000,1200000,1000000,1124000];
  const labels = ['May 14','May 15','May 16','May 17','May 18','May 19','May 20'];
  const ctx = document.getElementById('lineChart').getContext('2d');
  new Chart(ctx,{type:'line',data:{labels, datasets:[{label:'Penjualan',data:salesData,borderColor:'#0B5D4B',backgroundColor:'rgba(11,93,75,0.05)',tension:0.3}]},options:{responsive:true}});

  const dctx = document.getElementById('donutChart').getContext('2d');
  new Chart(dctx,{type:'doughnut',data:{labels:['Bakso Malang','Iced Tea','Mineral Water'],datasets:[{data:[78,12,10],backgroundColor:['#0B5D4B','#7CC36A','#9EE8B8']}]},options:{cutout:'70%'}});

  // dynamic summary from localStorage with dynamic indicators
  function calcSummary(){
    const sales = JSON.parse(localStorage.getItem('bl_sales')||'[]');
    const expenses = JSON.parse(localStorage.getItem('bl_expenses')||'[]');
    const today = new Date().toISOString().slice(0,10);
    const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
    
    // Calculate totals
    const totalS = sales.reduce((s,r)=>s+Number(r.total),0);
    const totalE = expenses.reduce((s,r)=>s+Number(r.total),0);
    
    // Calculate today's and yesterday's values
    const todaySales = sales.filter(r=>r.date===today).reduce((s,r)=>s+Number(r.total),0);
    const yesterdaySales = sales.filter(r=>r.date===yesterday).reduce((s,r)=>s+Number(r.total),0);
    const todayExpenses = expenses.filter(r=>r.date===today).reduce((s,r)=>s+Number(r.total),0);
    const yesterdayExpenses = expenses.filter(r=>r.date===yesterday).reduce((s,r)=>s+Number(r.total),0);
    
    // Calculate percentage changes
    const salesChange = yesterdaySales > 0 ? Math.round((todaySales - yesterdaySales) / yesterdaySales * 100) : 0;
    const expensesChange = yesterdayExpenses > 0 ? Math.round((todayExpenses - yesterdayExpenses) / yesterdayExpenses * 100) : 0;
    const profitChange = (todaySales - todayExpenses) > (yesterdaySales - yesterdayExpenses) ? 
      Math.round(((todaySales - todayExpenses) - (yesterdaySales - yesterdayExpenses)) / (yesterdaySales - yesterdayExpenses || 1) * 100) : 0;
    
    // Update values
    document.getElementById('totalSales').textContent = formatIDR(totalS || 1124000);
    document.getElementById('totalExpenses').textContent = formatIDR(totalE || 520000);
    document.getElementById('profit').textContent = formatIDR((totalS - totalE) || 604000);
    
    // Update status indicators
    const salesStatusEl = document.getElementById('salesStatus');
    const expensesStatusEl = document.getElementById('expensesStatus');
    const profitStatusEl = document.getElementById('profitStatus');
    
    salesStatusEl.textContent = salesChange > 0 ? `Naik ${salesChange}% dari kemarin` : salesChange < 0 ? `Turun ${Math.abs(salesChange)}% dari kemarin` : 'Sama seperti kemarin';
    expensesStatusEl.textContent = expensesChange > 0 ? `Naik ${expensesChange}% dari kemarin` : expensesChange < 0 ? `Turun ${Math.abs(expensesChange)}% dari kemarin` : 'Sama seperti kemarin';
    profitStatusEl.textContent = profitChange > 0 ? `Naik ${profitChange}% dari kemarin` : profitChange < 0 ? `Turun ${Math.abs(profitChange)}% dari kemarin` : 'Sama seperti kemarin';
    
    const inv = JSON.parse(localStorage.getItem('bl_inventory')||'[]');
    const low = inv.filter(i=>Number(i.stock)<=2).length;
    document.getElementById('lowStock').textContent = low + ' Item';
  }
  calcSummary();

  document.getElementById('viewInventory').addEventListener('click',()=> location='inventory.html');
});
