/* CMN prescription engine v1: explicit pricing records, never infer missing prices. */
(function(root){
'use strict';
const DRUGS={eliquis:{name:'Eliquis',strength:'5 mg',quantity:60,days:30},atorvastatin:{name:'Atorvastatin',strength:'20 mg',quantity:30,days:30},metformin:{name:'Metformin',strength:'500 mg',quantity:60,days:30}};
const BENCHMARKS={'H7993_091_0':1254,'H0354_030_0':724,'H0609_083_0':7913};
function validMedication(m){return !!(DRUGS[m?.id]&&Number.isInteger(Number(m.quantity))&&Number(m.quantity)>0&&Number(m.quantity)<=10000&&Number.isInteger(Number(m.days))&&Number(m.days)>0&&Number(m.days)<=365)}
function pricePlan(plan,medications,pharmacy,records){
 if(!medications.length)return {status:'no-medications',annual:0};
 if(!pharmacy?.id)return {status:'pharmacy-required',annual:null};
 if(medications.some(m=>!validMedication(m)))return {status:'invalid-input',annual:null};
 const key=plan.id+'|'+pharmacy.id,record=records?.[key];
 if(!record||record.year!==2027||record.status!=='validated')return {status:'pricing-unavailable',annual:null};
 const items=[];let annual=0;
 for(const m of medications){
  const quote=record.drugs?.[m.id];
  if(!quote||quote.quantity!==Number(m.quantity)||quote.days!==Number(m.days)||!Number.isFinite(quote.annualMemberCost)||quote.annualMemberCost<0)return {status:'pricing-unavailable',annual:null};
  annual+=quote.annualMemberCost;items.push({id:m.id,annual:quote.annualMemberCost});
 }
 // Multi-drug deductible and out-of-pocket interactions must be calculated together upstream.
 if(medications.length>1&&!record.combinedScenarioValidated)return {status:'combined-pricing-unavailable',annual:null};
 if(medications.length>1&&Number.isFinite(record.combinedAnnualMemberCost))annual=record.combinedAnnualMemberCost;
 return {status:'validated',annual,items,source:record.source||'',asOf:record.asOf||''};
}
root.CMN_DRUGS={catalog:DRUGS,benchmarks:BENCHMARKS,pricePlan,validMedication,pricingRecords:{}};
})(window);
