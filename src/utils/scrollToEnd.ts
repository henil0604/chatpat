export default function scrollToEnd(selector: string) {
    const dom = document.querySelector(selector);
    if (!dom) return false;
    dom.scrollTop = dom.scrollHeight
    return true;
}