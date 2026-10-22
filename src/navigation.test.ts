import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAddress } from './navigation.ts';
test('resolves domains, HTTPS links, and encoded searches',()=>{
  assert.equal(resolveAddress('example.com/path'),'https://example.com/path');
  assert.equal(resolveAddress('https://example.com/?q=test'),'https://example.com/?q=test');
  assert.equal(resolveAddress('faith & science'),'https://www.google.com/search?q=faith%20%26%20science');
  assert.equal(resolveAddress('اردو','duckduckgo'),'https://duckduckgo.com/?q=%D8%A7%D8%B1%D8%AF%D9%88');
});
test('rejects executable schemes, credentials and empty inputs',()=>{
  for(const value of ['javascript:alert(1)','data:text/html,test','file:///etc/passwd','https://user:pass@example.com','  ']) assert.throws(()=>resolveAddress(value));
});
