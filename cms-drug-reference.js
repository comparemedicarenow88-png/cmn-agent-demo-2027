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
window.CMN_DRUG_REFERENCE={lookup,estimateMemberCost,normalizeNdc};
})();