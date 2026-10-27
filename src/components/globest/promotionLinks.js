export const publicOrigin = 'https://ihbh.kopiagent.ai';
export const promotionUrl = id => `${publicOrigin}/promotion/${encodeURIComponent(id)}`;
export const inviteUrl = code => `${publicOrigin}/register?ref=${encodeURIComponent(code)}`;
export const productPath = product => `/?product=${encodeURIComponent(product.id)}#catalog`;