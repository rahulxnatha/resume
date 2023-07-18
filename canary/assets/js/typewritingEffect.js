export function typewritingEffect(element, speed) {
    const text = element.textContent;
    let index = 0;

    const type = () => {
        if (index < text.length) {
            element.textContent = text.slice(0, ++index);
            setTimeout(type, speed);
        }
    };

    type();
}



