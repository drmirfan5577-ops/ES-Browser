import { createHash, randomBytes } from 'node:crypto';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db/index';
import { entries } from '../../db/schema';
export default async (request: Request) => {
  const headers = new Headers({'Cache-Control':'no-store'});
  const token = request.headers.get('cookie')?.match(/(?:^|;\s*)es_session=([a-f0-9]{64})(?:;|$)/)?.[1] || randomBytes(32).toString('hex');
  // This opaque cookie is only a private anonymous-session credential.
  headers.set('Set-Cookie', `es_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=31536000`);
  const owner = createHash('sha256').update(token).digest('hex');
  const reply = (body: unknown, status=200) => Response.json(body, {status,headers});
  if (!['GET','POST','DELETE'].includes(request.method)) return reply({error:'Method not allowed'},405);
  if (request.method !== 'GET' && request.headers.get('origin') !== new URL(request.url).origin) return reply({error:'Invalid origin'},403);
  try {
    if (request.method === 'GET') return reply(await db.select({id:entries.id,kind:entries.kind,title:entries.title,url:entries.url,createdAt:entries.createdAt}).from(entries).where(eq(entries.owner,owner)).orderBy(desc(entries.createdAt)).limit(500));
    const body = await request.json();
    if (!['bookmark','history'].includes(body.kind)) return reply({error:'Invalid collection'},400);
    if (request.method === 'DELETE') {
      const filters = [eq(entries.owner,owner),eq(entries.kind,body.kind)];
      if (body.id) {
        if (typeof body.id !== 'string' || !/^[a-f0-9-]{36}$/i.test(body.id)) return reply({error:'Invalid ID'},400);
        filters.push(eq(entries.id,body.id));
      }
      await db.delete(entries).where(and(...filters));
      return reply({ok:true});
    }
    if (typeof body.url !== 'string' || body.url.length > 4096 || typeof body.title !== 'string' || body.title.length > 240) return reply({error:'Invalid link'},400);
    let url: URL;
    try {url = new URL(body.url);} catch {return reply({error:'Invalid URL'},400);}
    if (!['https:','http:'].includes(url.protocol) || url.username || url.password) return reply({error:'Invalid URL'},400);
    const [entry] = await db.insert(entries).values({owner,kind:body.kind,title:body.title,url:url.href}).returning({id:entries.id,kind:entries.kind,title:entries.title,url:entries.url,createdAt:entries.createdAt});
    return reply(entry,201);
  } catch { return reply({error:'Your library is unavailable. Please try again.'},503); }
};
export const config = {path:'/api/library'};
