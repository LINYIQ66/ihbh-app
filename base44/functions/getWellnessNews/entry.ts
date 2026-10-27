export default async function(req: Request): Promise<Response> {
  try {
    const search = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi');
    search.search = new URLSearchParams({ db: 'pubmed', term: '(nutrition OR dietary supplements) AND (clinical trial[Publication Type] OR systematic review[Publication Type])', sort: 'pub date', reldate: '90', retmax: '6', retmode: 'json' }).toString();
    const found = await fetch(search);
    if (!found.ok) throw new Error('PubMed search unavailable');
    const ids = (await found.json()).esearchresult?.idlist?.slice(0, 6) || [];
    if (!ids.length) return Response.json({ articles: [] });
    const details = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi');
    details.search = new URLSearchParams({ db: 'pubmed', id: ids.join(','), retmode: 'json' }).toString();
    const result = await fetch(details);
    if (!result.ok) throw new Error('PubMed article details unavailable');
    const data = (await result.json()).result || {};
    const articles = ids.map(id => data[id]).filter(Boolean).map(item => ({ id: item.uid, title: item.title, date: item.epubdate || item.pubdate, journal: item.fulljournalname || item.source, url: `https://pubmed.ncbi.nlm.nih.gov/${item.uid}/` }));
    return Response.json({ articles });
  } catch (error) {
    console.error('getWellnessNews', error);
    return Response.json({ error: error.message }, { status: 502 });
  }
}