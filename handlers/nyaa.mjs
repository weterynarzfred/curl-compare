export default function handleNyaa(dom) {
  const document = dom.window.document;
  const torrentListElement = document.querySelector('.torrent-list');

  const list = [...torrentListElement.querySelectorAll('tbody tr')].map(trElement => {
    const titleLink = trElement.querySelector('td:nth-child(2) a:not(.comments)');
    return {
      name: titleLink.textContent,
      url: titleLink.href,
    };
  });

  return list;
}
