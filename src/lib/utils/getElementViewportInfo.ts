/**
 * Returns Element placement information in Viewport
 * @link https://stackoverflow.com/a/70476497/2453148
 */
interface ViewportInfo {
    isInViewport: boolean;
    isPartiallyInViewport: boolean;
    isInsideViewport: boolean;
    isAroundViewport: boolean;
    isOnEdge: boolean;
    isOnTopEdge: boolean;
    isOnRightEdge: boolean;
    isOnBottomEdge: boolean;
    isOnLeftEdge: boolean;
}

/**
 * Gets Element placement information in the Viewport
 * @param el Element
 * @returns ViewportInfo
 */
function getElementViewportInfo(el: Element): ViewportInfo {
    const result: ViewportInfo = {
        isInViewport: false,
        isPartiallyInViewport: false,
        isInsideViewport: false,
        isAroundViewport: false,
        isOnEdge: false,
        isOnTopEdge: false,
        isOnRightEdge: false,
        isOnBottomEdge: false,
        isOnLeftEdge: false
    };

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const insideX = rect.left >= 0 && rect.left + rect.width <= windowWidth;
    const insideY = rect.top >= 0 && rect.top + rect.height <= windowHeight;

    result.isInsideViewport = insideX && insideY;

    const aroundX = rect.left < 0 && rect.left + rect.width > windowWidth;
    const aroundY = rect.top < 0 && rect.top + rect.height > windowHeight;

    result.isAroundViewport = aroundX && aroundY;

    const onTop = rect.top < 0 && rect.top + rect.height > 0;
    const onRight = rect.left < windowWidth && rect.left + rect.width > windowWidth;
    const onLeft = rect.left < 0 && rect.left + rect.width > 0;
    const onBottom = rect.top < windowHeight && rect.top + rect.height > windowHeight;

    const onY = insideY || aroundY || onTop || onBottom;
    const onX = insideX || aroundX || onLeft || onRight;

    result.isOnTopEdge = onTop && onX;
    result.isOnRightEdge = onRight && onY;
    result.isOnBottomEdge = onBottom && onX;
    result.isOnLeftEdge = onLeft && onY;

    result.isOnEdge = result.isOnLeftEdge || result.isOnRightEdge ||
        result.isOnTopEdge || result.isOnBottomEdge;

    const isInX =
        insideX || aroundX || result.isOnLeftEdge || result.isOnRightEdge;
    const isInY =
        insideY || aroundY || result.isOnTopEdge || result.isOnBottomEdge;

    result.isInViewport = isInX && isInY;

    result.isPartiallyInViewport =
        result.isInViewport && result.isOnEdge;

    return result;
}
