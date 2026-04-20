# Mini Markdown

자바스크립트 정규표현식을 이용하여 Markdown 문법을 HTML로 변환하는 파서를 구현한다.

## Quick Start Guide

1. VSCode Extensions에서 `Live Server`를 설치한다.
2. 레포지터리 루트 디렉터리에서 `Go Live`를 실행한다.

## Syntax

Markdown 문법은 다음 자료를 기준으로 구현한다.

- [Basic Syntax](https://www.markdownguide.org/basic-syntax/)
- [Extended Syntax](https://www.markdownguide.org/extended-syntax/)

Basic syntax와 Extended syntax를 순차적으로 구현한다.
우선 Basic syntax를 기준으로 기능을 정의한다.

## Basic Syntax

각 문법 요소는 다음과 같은 구조로 정의한다.

| Group               | Type            | Parameter               | HTML Tag       | Parse     | Nested | Done |
|:--------------------|:----------------|:------------------------|:--------------:|:----------|:------:|:----:|
| Headings            | HEADING         | level: [1,6]            | `<h1>`~`<h6>`  | Block     |        | V    |
|                     | HEADING(SETEXT) | level: 1                | `<h1>`         | Block     |        | V    |
|                     | HEADING(SETEXT) | level: 2                | `<h2>`         | Block     |        | V    |
| Paragraphs          | PARAGRAPH       |                         | `<p>`          | Block     |        | V    |
| Line Breaks         | LINE_BREAK      |                         | `<br>`         | Inline    |        | V    |
| Emphasis            | BOLD            |                         | `<b>`          | Inline    |        | V    |
|                     | BOLD_ALT        |                         | `<b>`          | Inline    |        | V    |
|                     | ITALIC          |                         | `<i>`          | Inline    |        | V    |
|                     | ITALIC_ALT      |                         | `<i>`          | Inline    |        | V    |
| Blockquotes         | BLOCKQUOTE      |                         | `<blockquote>` | Block     | Nested | V    |
| Lists               | O_LIST          |                         | `<ol>`         | Block     | Nested | V    |
|                     | U_LIST          |                         | `<ul>`         | Block     | Nested | V    |
|                     | LIST_ITEM       |                         | `<li>`         | Block     | Nested | V    |
| Code                | CODE_INLINE     |                         | `<code>`       | Inline    |        | V    |   
|                     | CODE_BLOCK      |                         | `<pre><code>`  | Block     |        | V    |
| Horizontal Rules    | HORIZONTAL_RULE |                         | `<hr>`         | Block     |        | V    |
|                     | LINK            | `text`, `href`, `title` | `<a>`          | Inline    |        | V    |
|                     | LINK_URL        | `href`,                 | `<a>`          | Inline    |        | V    |
|                     | LINK_EMAIL      | `href`,                 | `<a>`          | Inline    |        | V    |
|                     | LINK_REFERENCE  | `text`, `href`, `title` | `<a>`          | Inline    |        | V    |
| Images              | IMAGE           | `alt`, `src`            | `<img>`        | Inline    |        | V    |
| Escaping Characters | ESCAPE_PROTECT  |                         |                | Inline    |        | V    |
|                     | ESCAPE_RESTORE  |                         |                | Inline    |        | V    |
| HTML                | HTML            |                         |                | Block     |        | V    |



| Group               | Type            | Parameter               | HTML Tag       | Parse     | Nested | Done |
|:--------------------|:----------------|:------------------------|:--------------:|:----------|:------:|:----:|
|                     | LINK_REFERENCE  | `text`, `href`, `title` |                | Block     |        | V    |
| HTML                | HTML            |                         |                | Block     |        | V    |
|                     | CODE_BLOCK      |                         | `<pre><code>`  | Block     |        | V    |
| Blockquotes         | BLOCKQUOTE      |                         | `<blockquote>` | Block     | Nested | V    |
| Headings            | HEADING         | level: [1,6]            | `<h1>`~`<h6>`  | Block     |        | V    |
|                     | HEADING(SETEXT) | level: 1                | `<h1>`         | Block     |        | V    |
|                     | HEADING(SETEXT) | level: 2                | `<h2>`         | Block     |        | V    |
| Paragraphs          | PARAGRAPH       |                         | `<p>`          | Block     |        | V    |
| Lists               | O_LIST          |                         | `<ol>`         | Block     | Nested | V    |
|                     | U_LIST          |                         | `<ul>`         | Block     | Nested | V    |
|                     | LIST_ITEM       |                         | `<li>`         | Block     | Nested | V    |
| Code                | CODE_INLINE     |                         | `<code>`       | Inline    |        | V    |   
| Horizontal Rules    | HORIZONTAL_RULE |                         | `<hr>`         | Block     |        | V    |
|                     | LINK            | `text`, `href`, `title` | `<a>`          | Inline    |        | V    |
|                     | LINK_URL        | `href`,                 | `<a>`          | Inline    |        | V    |
|                     | LINK_EMAIL      | `href`,                 | `<a>`          | Inline    |        | V    |
|                     | LINK_REFERENCE  | `text`, `href`, `title` | `<a>`          | Inline    |        | V    |
| Images              | IMAGE           | `alt`, `src`            | `<img>`        | Inline    |        | V    |
| Escaping Characters | ESCAPE_PROTECT  |                         |                | Inline    |        | V    |
|                     | ESCAPE_RESTORE  |                         |                | Inline    |        | V    |
| Line Breaks         | LINE_BREAK      |                         | `<br>`         | Inline    |        | V    |
| Emphasis            | BOLD            |                         | `<b>`          | Inline    |        | V    |
|                     | BOLD_ALT        |                         | `<b>`          | Inline    |        | V    |
|                     | ITALIC          |                         | `<i>`          | Inline    |        | V    |
|                     | ITALIC_ALT      |                         | `<i>`          | Inline    |        | V    |

## Implementation

파서는 다음과 같은 구조로 구성한다.

- Parser: Markdown 문서를 파싱하여 요소 트리를 생성한다.
  - Block Parser: 블록 요소를 파싱한다.
  - Inline Parser: 인라인 요소를 파싱한다.
- Renderer: 파싱된 요소를 HTML로 변환한다.

Block Parser는 입력을 줄 단위로 처리한다.
각 줄에 대해 정규표현식을 사용하여 요소의 종류를 판단하고 해당 노드를 생성한다.

Inline Parser는 각 블록 요소의 내용을 처리한다.
`TEXT` 노드를 대상으로 인라인 요소를 파싱하여 하위 노드를 생성한다.

Renderer는 요소 트리를 순회하며 HTML로 변환한다.

요소 트리는 다음과 같은 구조를 가진다.

- 요소 노드: `type`, `children`, `parameter`를 가진다.
- Leaf 노드: `TEXT` 노드로, 실제 텍스트 내용을 담는다.

각 요소 노드는 다음 속성을 가진다.

- type: 요소의 종류를 나타내는 문자열이다.
- children: 요소의 자식 노드들을 담는 배열이다.
- parameter: 요소의 추가 정보를 담는 객체이다.

Block Parser는 다음 순서로 요소를 판단한다.

1. LINK_REFERENCE
1. HTML
1. CODE_BLOCK
1. BLOCKQUOTE
1. O_LIST
1. U_LIST
1. HEADING
1. HORIZONTAL_RULE
1. PARAGRAPH

Inline Parser는 TEXT 노드의 내용을 파싱한다.
인라인 요소는 다음 순서로 판단한다:

1. ESCAPE_PROTECT
1. IMAGE
1. LINK
1. LINK_URL
1. LINK_EMAIL
1. LINK_REFERENCE
1. LINE_BREAK
1. BOLD
1. BOLD_ALT
1. ITALIC
1. ITALIC_ALT
1. CODE_INLINE
1. ESCAPE_RESTORE

| Group           | Markdown                                                | HTML                                                          |
|-----------------|---------------------------------------------------------|---------------------------------------------------------------|
| HEADING         | `# Heading 1`                                           | `<h1>Heading 1</h1>`                                          |
| HEADING(SETEXT) | `Heading 1<br>=======`                                  | `<h1>Heading 1</h1>`                                          |
| HEADING(SETEXT) | `Heading 2<br>-------`                                  | `<h2>Heading 2</h2>`                                          |
| PARAGRAPH       | `Paragraph 1<br><br>Paragraph 2`                        | `<p>Paragraph 1</p><p>Paragraph 2</p>`                        |
| LINE_BREAK      | `Line1&nbsp;&nbsp;<br>Line2`                            | `Line1<br>Line2`                                              |
| BOLD            | `**Bold**`                                              | `<b>Bold</b>`                                                 |
| BOLD_ALT        | `__Bold__`                                              | `<b>Bold</b>`                                                 |
| ITALIC          | `*Italic*`                                              | `<i>Italic</i>`                                               |
| ITALIC_ALT      | `_Italic_`                                              | `<i>Italic</i>`                                               |
| BLOCKQUOTE      | `> Blockquote`                                          | `<blockquote>Blockquote</blockquote>`                         |
| O_LIST          | `1. Item`                                               | `<ol><li>Item</li></ol>`                                      |
| U_LIST          | `- Item`                                                | `<ul><li>Item</li></ul>`                                      |
| LIST_ITEM       | `- Item`                                                | `<li>Item</li>`                                               |
| CODE_INLINE     | `` `Inline Code` ``                                     | `<code>Inline Code</code>`                                    |
| CODE_BLOCK      | `    Code Block`                                        | `<pre><code>Code Block</code></pre>`                          |
| HORIZONTAL_RULE | `---`                                                   | `<hr>`                                                        |
| LINK            | `[Google](https://www.google.com "Google")`             | `<a href="https://www.google.com" title="Google">Google</a>`  |
| LINK_URL        | `<https://www.google.com>`                              | `<a href="https://www.google.com">https://www.google.com</a>` |
| LINK_EMAIL      | `<kmini15@naver.com>`                                   | `<a href="mailto:kmini15@naver.com">kmini15@naver.com</a>`    |
| LINK_REFERENCE  | `[Google][1]` + `[1]: https://www.google.com "Google"`  | `<a href="https://www.google.com" title="Google">Google</a>`  |
| IMAGE           | `![Alt Text](https://www.google.com/image.png)`         | `<img src="https://www.google.com/image.png" alt="Alt Text">` |
| ESCAPE_PROTECT  | `\*Not Italic\*`                                        | `*Not Italic*`                                                |
| ESCAPE_RESTORE  | `*Not Italic*`                                          | `*Not Italic*`                                                |
| HTML            | `<h1>Heading</h1>`                                      | `<h1>Heading</h1>`                                            |

- HEADING(ATX): `#{1,6} `로 시작하는 줄을 Heading으로 변환한다. `#`의 개수에 따라 Heading의 레벨이 결정된다.
- HEADING(SETEXT): 바로 아래줄에 `=` 혹은 `-` 문자가 1개 이상 있을 경우 Heading으로 변환한다. `=` 문자는 Heading 1, `-` 문자는 Heading 2로 변환한다.
- PARAGRAPH: 한 줄 이상의 공백이 있을 경우 paragraph를 생성한다.
- LINE_BREAK: 줄 끝에

---

### Headings

| Markdown | HTML | Result |
|----------|------|--------|
| # Heading 1      | `<h1>Heading 1</h1>` | <h1>Heading 1</h1> |
| ## Heading 2     | `<h2>Heading 2</h2>` | <h2>Heading 2</h2> |
| ### Heading 3    | `<h3>Heading 3</h3>` | <h3>Heading 3</h3> |
| #### Heading 4   | `<h4>Heading 4</h4>` | <h4>Heading 4</h4> |
| ##### Heading 5  | `<h5>Heading 5</h5>` | <h5>Heading 5</h5> |
| ###### Heading 6 | `<h6>Heading 6</h6>` | <h6>Heading 6</h6> |

바로 아래줄에 `=` 혹은 `-` 문자가 1개 이상 있을 경우 Heading으로 변환

| Markdown | HTML | Result |
|----------|------|--------|
| Heading 1<br>======= | `<h1>Heading 1</h1>` | <h1>Heading 1</h1> |
| Heading 2<br>------- | `<h2>Heading 2</h2>` | <h2>Heading 2</h2> |

---

### Paragraphs

한 줄 이상의 공백이 있을 경우 paragraph 생성

| Markdown | HTML | Result |
|----------|------|--------|
| paragraph 1<br><br>paragraph 2 | `<p>paragraph 1</p>`<br>`<p>paragraph 2</p>` | <p>paragraph 1</p><p>paragraph 2</p> |

---

### Line Breaks

| Markdown | HTML | Result |
|----------|------|--------|
| Line1&nbsp;&nbsp;<br>Line2 | `<p>Line1<br>`<br>`Line2</p>` | Line1<br>Line2 |

---

### Emphasis

| Markdown | HTML | Result |
|----------|------|--------|
| `**Bold**`          | `<b>Bold</b>`          | <b>Bold</b>          |
| `*Italic*`          | `<i>Italic</i>`        | <i>Italic</i>        |
| `~~Strikethrough~~` | `<s>Strikethrough</s>` | <s>Strikethrough</s> |

---

### Blockquotes

#### Markdown
```text
> Level 1
>> Level 2-1
>>> Level 3-1  
>>> Level 3-2  
Level 3-3
Level 3-4
>>>> Level 4
>>>>> Level 5
>>>>>> Level 6
```
#### HTML
```html
<blockquote>
  <p>Level 1</p>
  <blockquote>
    <p>Level 2-1</p>
    <blockquote>
      <p>Level 3-1<br>
      Level 3-2<br>
      Level 3-3
      Level 3-4</p>
      <blockquote>
        <p>Level 4</p>
        <blockquote>
          <p>Level 5</p>
            <blockquote>
              <p>Level 6</p>
            </blockquote>
        </blockquote>
      </blockquote>
    </blockquote>
  </blockquote>
</blockquote>
```
#### Result
> Level 1
>> Level 2-1
>>> Level 3-1  
>>> Level 3-2  
Level 3-3
Level 3-4
>>>> Level 4
>>>>> Level 5
>>>>>> Level 6

---

### Lists

| Markdown | HTML | Result |
|----------|------|--------|
| `- Item`  | `<ul><li>Item</li></ul>` | <ul><li>Item</li></ul> |
| `+ Item`  | `<ul><li>Item</li></ul>` | <ul><li>Item</li></ul> |
| `* Item`  | `<ul><li>Item</li></ul>` | <ul><li>Item</li></ul> |
| `1. Item` | `<ol><li>Item</li></ol>` | <ol><li>Item</li></ol> |

#### Markdown
```text
- Item
  + Item
```

#### HTML
```html
<ul>
  <li>Item</li>
  <ul>
    <li>Item</li>
  </ul>
</ul>
```

#### Result
<ul>
  <li>Item</li>
  <ul>
    <li>Item</li>
  </ul>
</ul>

---

### Code

---

### Code Blocks

---

### Horizontal Rules

---

### Links

---

### Images

---

### HTML

---

## Extended Syntax

---

## Custom Syntax

### Grid
```
::::[4:8px]
  ![img](url)
  ![img](url)
  ![img](url)
::::
```
