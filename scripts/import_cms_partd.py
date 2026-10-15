#!/usr/bin/env python3
"""Extract 2027 CMS Part D rows matching CMN's 52 plan/segment identifiers.

Usage:
  python scripts/import_cms_partd.py --monthly MONTHLY.zip --quarterly QUARTERLY.zip
  python scripts/import_cms_partd.py --monthly MONTHLY.zip
Requires Python 3 standard library only. Never substitutes another contract year.
Outputs filtered source tables and a machine-readable reconciliation report.
"""
import argparse,csv,io,json,re,zipfile
from pathlib import Path
from collections import Counter

ROOT=Path(__file__).resolve().parents[1]
def roster():
    raw=(ROOT/'demo-data.js').read_text(encoding='utf-8')
    prefix='window.CMN_DEMO_PLANS='
    if not raw.startswith(prefix): raise ValueError('Unexpected roster format')
    data=json.loads(raw[len(prefix):].strip().rstrip(';'))
    ids={p['id'] for p in data}
    if len(data)!=52 or len(ids)!=52: raise ValueError('Expected 52 unique plan segments')
    return ids

def norm(s):return re.sub(r'[^a-z0-9]','',s.lower())
def find_col(headers, candidates):
    indexed={norm(h):h for h in headers}
    for name in candidates:
        if norm(name) in indexed:return indexed[norm(name)]
    return None

def scan_archive(path,ids,out):
    counts=Counter();matches=set();skipped=[]
    with zipfile.ZipFile(path) as z:
        for item in z.infolist():
            if item.is_dir() or not item.filename.lower().endswith(('.txt','.csv','.dat')):continue
            with z.open(item) as binary:
                stream=io.TextIOWrapper(binary,encoding='utf-8-sig',errors='replace',newline='')
                first=stream.readline()
                delimiter='|' if first.count('|')>=first.count(',') else ','
                stream.seek(0)
                reader=csv.DictReader(stream,delimiter=delimiter)
                headers=reader.fieldnames or []
                contract=find_col(headers,['contract_id','contractid','contract'])
                plan=find_col(headers,['plan_id','planid'])
                segment=find_col(headers,['segment_id','segmentid'])
                if not contract or not plan:
                    skipped.append({'file':item.filename,'reason':'No contract and plan identifier columns','headers':headers[:25]})
                    continue
                target=out/(re.sub(r'[^a-zA-Z0-9_.-]','_',Path(item.filename).name)+'.filtered.csv')
                count=0
                with target.open('w',encoding='utf-8',newline='') as f:
                    writer=csv.DictWriter(f,fieldnames=headers);writer.writeheader()
                    for row in reader:
                        c=(row.get(contract) or '').strip().upper()
                        p=(row.get(plan) or '').strip().zfill(3)
                        s=(row.get(segment) or '0').strip().zfill(1) if segment else None
                        candidates=[f'{c}_{p}_{s}'] if s is not None else [x for x in ids if x.startswith(f'{c}_{p}_')]
                        hit=[x for x in candidates if x in ids]
                        if hit:
                            writer.writerow(row);count+=1;matches.update(hit)
                if count:counts[item.filename]=count
                else:target.unlink()
    return {'matched_plan_segments':sorted(matches),'matched_count':len(matches),'row_counts':dict(counts),'skipped_tables':skipped}

def main():
    a=argparse.ArgumentParser();a.add_argument('--monthly',type=Path);a.add_argument('--quarterly',type=Path);a.add_argument('--out',type=Path,default=Path('cms-import-output'));args=a.parse_args()
    if not args.monthly and not args.quarterly:a.error('Provide at least one archive')
    ids=roster();args.out.mkdir(parents=True,exist_ok=True)
    report={'expected_plan_segments':52,'year_requested':2027,'archives':{},'note':'Raw filtered CMS data only; not validated member prices or rankings.'}
    for kind,path in [('monthly',args.monthly),('quarterly',args.quarterly)]:
        if path:
            if not path.exists():a.error(f'Missing archive: {path}')
            # Archive filenames must explicitly identify the 2027 contract year.
            if not re.search(r'(?<!\d)2027(?!\d)',path.name):a.error(f'{kind} archive filename must identify contract year 2027: {path.name}')
            report['archives'][kind]=scan_archive(path,ids,args.out/kind if False else args.out)
    (args.out/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2))
if __name__=='__main__':main()
