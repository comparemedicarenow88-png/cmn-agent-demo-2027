/* CMN 2027 drug reference-price preview. Not part of plan rankings. */
(function(){'use strict';
const testDrugs=[
{id:'drugEliquis',name:'Eliquis 5 mg',ndc:'00003089321',qty:60},
{id:'drugAtorvastatin',name:'Atorvastatin 20 mg',ndc:null,qty:30},
{id:'drugMetformin',name:'Metformin 500 mg',ndc:null,qty:60}
];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;'}[c]));
const usd=v=>'$'+Number(v).toFixed(2);
function preview(){
 const target=document.getElementById('drugPreview');if(!target)return;
 const selected=testDrugs.filter(x=>document.getElementById(x.id)?.checked);
 if(!selected.length){target.textContent='Select a test drug to inspect the CMS 2027 reference-price status.';return;}
 const priceData=window.CMN_NEGOTIATED_2027;
 target.innerHTML=selected.map(d=>{
 const result=d.ndc&&priceData?priceData.lookup(d.ndc,d.qty):{status:'Price Unavailable'};
 if(result.status!=='Estimated Cost')return '<p><b>'+esc(d.name)+'</b>: Price Unavailable — no verified matching reference price in this negotiated-price dataset.</p>';
 return '<p><b>'+esc(d.name)+'</b>: '+usd(result.referenceDrugCost)+' per 30-day supply; '+usd(result.referenceDrugCost*12)+' for 12 fills at the CMS maximum fair price ('+esc(result.ndc11)+'). <b>Reference drug price only, not member out-of-pocket cost.</b></p>';
 }).join('')+'<p class="muted">These amounts are not included in plan rankings. A member-cost estimate also requires verified 2027 plan formulary coverage, deductible, cost sharing and pharmacy assumptions. Plans without Part D should be labeled No Benefit in plan-specific results. MFP reference prices may differ from pharmacy transaction prices.</p>';
}
document.addEventListener('DOMContentLoaded',()=>{
testDrugs.forEach(d=>document.getElementById(d.id)?.addEventListener('change',preview));preview();
});
window.CMN_DRUG_PREVIEW_2027={preview};
})();
