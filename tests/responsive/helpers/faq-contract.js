const { expect } = require('@playwright/test');

async function checkFaqMarkers(page) {
    const markers = await page.locator('.faq-system .faq-question:visible').evaluateAll((questions) => questions.map((question) => {
        const marker = getComputedStyle(question, '::after');
        const transform = new DOMMatrixReadOnly(marker.transform);
        const range = document.createRange();
        range.selectNodeContents(question);
        const textRight = Math.max(...[...range.getClientRects()].map((rect) => rect.right));
        const markerLeft = question.getBoundingClientRect().right - parseFloat(marker.right) - parseFloat(marker.width);
        return {
            question: question.textContent.trim(),
            content: marker.content.replace(/^"|"$/g, ''),
            expected: question.closest('details').open ? '−' : '+',
            position: marker.position,
            right: parseFloat(marker.right),
            centerError: Math.abs(parseFloat(marker.top) + transform.f + parseFloat(marker.height) / 2 - question.clientHeight / 2),
            rotation: transform.b,
            textGap: markerLeft - textRight
        };
    }));
    for (const marker of markers) {
        expect(marker.content, marker.question).toBe(marker.expected);
        expect(marker.position, marker.question).toBe('absolute');
        expect(marker.right, marker.question).toBeGreaterThanOrEqual(16);
        expect(marker.right, marker.question).toBeLessThanOrEqual(20);
        expect(marker.centerError, marker.question).toBeLessThanOrEqual(1);
        expect(marker.rotation, marker.question).toBe(0);
        expect(marker.textGap, marker.question).toBeGreaterThanOrEqual(7);
    }
    return markers.length;
}

module.exports = { checkFaqMarkers };
