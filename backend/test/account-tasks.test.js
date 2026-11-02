import test from 'node:test';
import assert from 'node:assert/strict';
import {createDemoAccount} from '../../shared/demo.js';
import {accountTasks,reviewDocumentChecklist} from '../../shared/account-tasks.js';
import {describeAccountChanges} from '../../shared/account-changes.js';
test('bill tasks respect ownership and live remaining balance',()=>{const state=createDemoAccount();assert.equal(accountTasks(state,1).some(t=>t.id==='bill'),false);assert.match(accountTasks({...state,squirrelFund:{appliedCents:700}},0)[0].title,/157.00/);assert.equal(accountTasks({...state,paid:true},0)[0].status,'complete');});
test('checklist completion persists for its member without approving an identity or rewarding credits',()=>{const state=createDemoAccount(),next=reviewDocumentChecklist(state,1);assert.equal(accountTasks(next,1)[0].status,'complete');assert.equal(accountTasks(next,2)[0].status,'action');assert.equal(accountTasks(state,1)[0].status,'action');assert.equal(next.credits,state.credits);assert.equal(reviewDocumentChecklist(next,1),next);assert.ok(describeAccountChanges(state,next).some(c=>c.field.includes('document checklist')&&c.after==='Reviewed'));});
