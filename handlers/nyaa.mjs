export default dom => [...dom.window.document.querySelectorAll('.torrent-list tbody tr')]
  .map(trElement => {
    const titleLink = trElement.querySelector('td:nth-child(2) a:not(.comments)');
    return { name: titleLink.textContent, url: titleLink.href };
  });
