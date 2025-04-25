export default function handle1337x(dom, {
  HTMLFilter = () => true,
  returnFilter = () => true,
}) {
  const document = dom.window.document;
  const torrentListElement = document.querySelector('.table-list');

  const list = [...torrentListElement.querySelectorAll('tbody tr')]
    .filter(HTMLFilter)
    .map(trElement => {
      const titleLink = trElement.querySelector('td:nth-child(1) a:not(.icon)');
      return {
        name: titleLink.textContent,
        url: titleLink.href,
      };
    })
    .filter(returnFilter);

  return list;
}
