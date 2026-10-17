/* 2027 CMS MFP reference pricing. This is NOT plan member cost. */
(function(){
'use strict';
const index=window.CMN_CMS_MFP_2027||{};
const normalizeNdc=value=>String(value??'').replace(/\D/g,'').padStart(11,'0');
function lookup(ndc,quantity){
 const key=normalizeNdc(ndc),record=index[key],qty=Number(quantity);
 if(!/^\d{11}$/.test(key)||!Number.isFinite(qty)||qty<=0)return {status:'invalid-input'};
 if(!record)return {status:'price-unavailable',ndc:key};
 return {status:'reference-only',ndc:key,drug:record.drug,mfpPerUnit:record.mfpPerUnit,quantity:qty,referenceCost:Math.round(record.mfpPerUnit*qty*100)/100,effectiveDate:record.effectiveDate,notice:'CMS MFP reference amount only; NOT a plan copay, member cost, or confirmed pharmacy price.'};
}
function estimateMemberCost(referenceMonthlyCost,months,deductible,coinsurance){
 const cost=Number(referenceMonthlyCost),m=Number(months),d=Number(deductible),c=Number(coinsurance);
 if(![cost,m,d,c].every(Number.isFinite)||cost<0||m<0||d<0||c<0||c>1)return null;
 const total=cost*m;
 return Math.round((Math.min(d,total)+Math.max(0,total-d)*c)*100)/100;
}
function calculatePlanScenario(plan,ndc,quantity,fills,assumptions){
 const reference=lookup(ndc,quantity),n=Number(fills);
 if(!plan)return {status:'plan-unavailable'};
 if(plan.drugCoverage==='No')return {status:'no-part-d-benefit',planId:plan.id,memberCost:null,notice:'This plan does not include Part D; separate prescription coverage/cash costs are not calculated.'};
 if(plan.drugCoverage!=='Yes')return {status:'coverage-unverified',planId:plan.id,memberCost:null};
 if(reference.status!=='reference-only')return {status:reference.status,planId:plan.id,memberCost:null};
 if(!Number.isInteger(n)||n<1||n>36)return {status:'invalid-fills',memberCost:null};
 const deductible=Number(assumptions?.deductible),coinsurance=Number(assumptions?.coinsurance);
 if(!Number.isFinite(deductible)||deductible<0||!Number.isFinite(coinsurance)||coinsurance<0||coinsurance>1)return {status:'assumptions-required',memberCost:null};
 const memberCost=estimateMemberCost(reference.referenceCost,n,deductible,coinsurance);
 return {status:'illustrative-only',planId:plan.id,memberCost,referenceAnnualCost:Math.round(reference.referenceCost*n*100)/100,assumptions:{deductible,coinsurance},notice:'Hypothetical calculation only: formulary coverage, preferred CVS network rate, tier, deductible applicability, dispensing fees, other prescriptions and 2027 Part D out-of-pocket limit not verified. Not suitable for ranking or enrollment decisions.'};
}
window.CMN_DRUG_REFERENCE={lookup,estimateMemberCost,normalizeNdc,calculatePlanScenario};
})();