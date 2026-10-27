import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const schema=name=>JSON.parse(fs.readFileSync(path.join(root,'base44/entities',`${name}.jsonc`),'utf8'));
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}

test('financial entities deny direct client writes, including forged paid profiles',()=>{
 for(const entity of ['MemberProfile','Ticket','Withdrawal','PurchaseOrder','PointsLedger','FinancialOperation','SalesOrder','Referral','ShipOrder']){
  const s=schema(entity);for(const op of ['create','update','delete'])assert.equal(s.rls[op],false,`${entity}.${op}`);
 }
 const user=schema('User');for(const f of ['finance_state','finance_version','finance_pending','invite_code','referred_by_code'])assert.equal(user.properties[f].rls.write,false,f);
 assert.deepEqual(user.properties.partner_status.rls.write,{user_condition:{role:'admin'}});
 assert.ok(!schema('MemberProfile').properties.payment_status.default);
});
test('all backend source files parse as TypeScript without syntax errors',()=>{
 for(const file of files(path.join(root,'base44')).filter(f=>f.endsWith('.ts'))){
  const result=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
  assert.deepEqual((result.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error),[],file);
 }
});
let sequence=0;
async function handler(name,client){
 const filename=path.join(root,'base44/functions',name,'entry.ts');
 let source=fs.readFileSync(filename,'utf8').replace(/import\s*\{\s*createClientFromRequest\s*\}\s*from\s*['"]npm:@base44\/sdk@[^'"]+['"];?/,'const capturedClient=globalThis.__testClient; const createClientFromRequest=()=>capturedClient;');
 source=source.replace(/import\s*\{\s*secrets\s*\}\s*from\s*['"]base44:runtime['"];?/,'const secrets={get:()=>"test-secret"};');
 source=source.replace(/import Stripe from ['"]npm:stripe@[^'"]+['"];?/,'const Stripe=class {};');
 source=source.replace(/from\s*(['"])(\.\.[^'"]+)\1/g,(_,q,p)=>`from ${q}${pathToFileURL(path.resolve(path.dirname(filename),p)).href}${q}`);
 globalThis.__testClient=client;
 const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 return (await import(`data:text/javascript;base64,${Buffer.from(js+`\n//${sequence++}`).toString('base64')}`)).default;
}
test('privileged business/AI endpoints reject anonymous requests before accessing service data',async()=>{
 const client={auth:{me:async()=>null},get asServiceRole(){throw Error('anonymous accessed service role');}};
 for(const name of ['pointsLedger','commerce','createMembershipCheckout','createGeneCellCheckout','customerServiceReply','analyzeFaceReading','recordReferral','ensureInviteCode','reconcileFinance','dealerPolicy']){
  const fn=await handler(name,client),result=await fn(new Request('http://local.test',{method:'POST',body:'{}'}));assert.ok([401,403].includes(result.status),`${name}: ${result.status}`);
 }
});
test('an editable partner hint does not grant product publishing privileges',async()=>{
 let creates=0;const client={auth:{me:async()=>({id:'u',role:'user',partner_status:'approved'})},asServiceRole:{entities:{AgentApplication:{count:async()=>0},Product:{create:async()=>{creates++;}}}}};
 const fn=await handler('submitPartnerProduct',client);const res=await fn(new Request('http://local.test',{method:'POST',body:'{}'}));assert.equal(res.status,403);assert.equal(creates,0);
});
test('ordinary users cannot invoke financial reconciliation',async()=>{
 const fn=await handler('reconcileFinance',{auth:{me:async()=>({id:'u',role:'user'})},get asServiceRole(){throw Error('unauthorized service use');}});
 const result=await fn(new Request('http://local.test',{method:'POST',body:'{}'}));assert.equal(result.status,403);
});
