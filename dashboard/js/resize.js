function makeResizable(resizer, prev, next, isHorizontal) {
    let startPos, startPrev;

    resizer.addEventListener('mousedown', e => {
        startPos = isHorizontal ? e.clientY : e.clientX;
        startPrev = isHorizontal ? prev.offsetHeight : prev.offsetWidth;

        function onMouseMove(e) {
            const delta = (isHorizontal ? e.clientY : e.clientX) - startPos;
            if (isHorizontal) {
                const newHeight = startPrev + delta;
                // Prevent overflow: newHeight must leave space for footer
                const footerHeight = document.querySelector('footer').offsetHeight;
                const maxHeight = window.innerHeight - footerHeight - resizer.offsetHeight;
                prev.style.height = `${Math.min(maxHeight, Math.max(50, newHeight))}px`;
            } else {
                prev.style.width = `${Math.max(100, startPrev + delta)}px`;
            }
        }

        function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById('appHeader');
    const headerResizer = document.getElementById('headerResizer');
    const main = document.getElementById('mainArea');

    const tileContainer = document.getElementById('tileContainer');
    const mainResizer = document.getElementById('mainResizer');
    const detailPane = document.getElementById('detailPane');

    makeResizable(headerResizer, header, main, true);
    makeResizable(mainResizer, tileContainer, detailPane, false);
});
