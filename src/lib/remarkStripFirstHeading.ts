import type { Content, Heading, PhrasingContent, Root } from 'mdast';

function isHeadingNode(node: Content): node is Heading {
    return node.type === 'heading';
}

function getFirstRenderableNodeIndex(children: Content[]): number {
    for (let index = 0; index < children.length; index += 1) {
        if (children[index].type !== 'definition') {
            return index;
        }
    }

    return -1;
}

function isPhrasingContentWithChildren(node: PhrasingContent): node is PhrasingContent & { children: PhrasingContent[] } {
    return 'children' in node;
}

function getHeadingTextContent(children: PhrasingContent[]): string {
    return children
        .map((child) => {
            if (child.type === 'text' || child.type === 'inlineCode') {
                return child.value;
            }

            if (child.type === 'break') {
                return ' ';
            }

            if (child.type === 'image') {
                return child.alt || '';
            }

            if (isPhrasingContentWithChildren(child)) {
                return getHeadingTextContent(child.children);
            }

            return '';
        })
        .join('')
        .trim();
}

export function getFirstHeading(tree: Root): Heading | null {
    const firstRenderableNodeIndex = getFirstRenderableNodeIndex(tree.children);

    if (firstRenderableNodeIndex === -1) {
        return null;
    }

    const firstRenderableNode = tree.children[firstRenderableNodeIndex];

    if (!isHeadingNode(firstRenderableNode)) {
        return null;
    }

    return firstRenderableNode;
}

export function getFirstHeadingText(tree: Root): string | null {
    const firstHeading = getFirstHeading(tree);

    if (!firstHeading) {
        return null;
    }

    return getHeadingTextContent(firstHeading.children);
}

export function remarkStripFirstHeading() {
    return (tree: Root) => {
        const firstHeading = getFirstHeading(tree);

        if (!firstHeading) {
            return;
        }

        const firstRenderableNodeIndex = getFirstRenderableNodeIndex(tree.children);

        if (firstRenderableNodeIndex !== -1 && firstHeading.depth === 1) {
            tree.children.splice(firstRenderableNodeIndex, 1);
        }
    };
}
