export default function addStyles(id, styles) {
  if(!document.getElementById(id)){
    const styleNode = document.createElement('style');
    styleNode.id = id;
    styleNode.innerHTML = styles;
    document.head.append(styleNode);
  }
}
