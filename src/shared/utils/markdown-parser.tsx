import type { ReactNode } from 'react'

interface MarkdownNode {
    type: 'text' | 'bold' | 'italic' | 'code' | 'link' | 'lineBreak'
    content: string
    url?: string
}

/**
 * Простой парсер markdown для базовых случаев
 * Поддерживает:
 * - **текст** -> жирный
 * - *текст* -> курсив
 * - `текст` -> код
 * - [текст](url) -> ссылки
 * - \n -> перенос строки
 */
export const parseMarkdown = (text: string): MarkdownNode[] => {
    const nodes: MarkdownNode[] = []
    let index = 0

    while (index < text.length) {
        // Проверяем ссылки [текст](url)
        const linkMatch = text.slice(index).match(/^\[([^\]]+)\]\(([^)]+)\)/)
        if (linkMatch) {
            nodes.push({
                type: 'link',
                content: linkMatch[1],
                url: linkMatch[2],
            })
            index += linkMatch[0].length
            continue
        }

        // Проверяем жирный текст **текст**
        const boldMatch = text.slice(index).match(/^\*\*([^*]+)\*\*/)
        if (boldMatch) {
            nodes.push({
                type: 'bold',
                content: boldMatch[1],
            })
            index += boldMatch[0].length
            continue
        }

        // Проверяем курсив *текст* (но не **)
        const italicMatch = text.slice(index).match(/^\*([^*\n]+)\*/)
        if (italicMatch && !text.slice(index).startsWith('**')) {
            nodes.push({
                type: 'italic',
                content: italicMatch[1],
            })
            index += italicMatch[0].length
            continue
        }

        // Проверяем код `текст`
        const codeMatch = text.slice(index).match(/^`([^`]+)`/)
        if (codeMatch) {
            nodes.push({
                type: 'code',
                content: codeMatch[1],
            })
            index += codeMatch[0].length
            continue
        }

        // Проверяем перенос строки
        if (text[index] === '\n') {
            nodes.push({
                type: 'lineBreak',
                content: '\n',
            })
            index++
            continue
        }

        // Обычный текст - собираем до следующего специального символа
        let textEnd = index
        while (
            textEnd < text.length &&
            text[textEnd] !== '*' &&
            text[textEnd] !== '`' &&
            text[textEnd] !== '[' &&
            text[textEnd] !== '\n'
        ) {
            textEnd++
        }

        if (textEnd > index) {
            nodes.push({
                type: 'text',
                content: text.slice(index, textEnd),
            })
            index = textEnd
        } else {
            // Если не нашли совпадений, добавляем один символ как текст
            nodes.push({
                type: 'text',
                content: text[index],
            })
            index++
        }
    }

    return nodes
}

export const renderMarkdown = (text: string): ReactNode => {
    const nodes = parseMarkdown(text)
    const result: ReactNode[] = []
    let key = 0

    for (const node of nodes) {
        switch (node.type) {
            case 'bold': {
                result.push(
                    <strong key={key++} style={{ fontWeight: 'bold' }}>
                        {node.content}
                    </strong>
                )
                break
            }
            case 'italic': {
                result.push(
                    <em key={key++} style={{ fontStyle: 'italic' }}>
                        {node.content}
                    </em>
                )
                break
            }
            case 'code': {
                result.push(
                    <code
                        key={key++}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '0.9em',
                        }}
                    >
                        {node.content}
                    </code>
                )
                break
            }
            case 'link': {
                result.push(
                    <a
                        key={key++}
                        href={node.url}
                        rel='noopener noreferrer'
                        target='_blank'
                        style={{
                            color: 'inherit',
                            textDecoration: 'underline',
                        }}
                    >
                        {node.content}
                    </a>
                )
                break
            }
            case 'lineBreak': {
                result.push(<br key={key++} />)
                break
            }
            case 'text': {
                result.push(node.content)
                break
            }
        }
    }

    return <>{result}</>
}
