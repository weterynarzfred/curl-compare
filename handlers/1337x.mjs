export default (dom, { filter = () => true }) => [...dom.window.document.querySelectorAll('.table-list tbody tr')]
  .map(trElement => {
    const titleLink = trElement.querySelector('td:nth-child(1) a:not(.icon)');
    return { name: titleLink.textContent, url: titleLink.href };
  }).filter(filter);
