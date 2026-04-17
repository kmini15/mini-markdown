# Mini Markdown

자바스크립트 정규표현식을 사용하여 구현한 Markdown parser.

## Quick Start Guide

1. VSCode Extensions에서 `Live Server`를 설치
2. 레포지터리 루트 디렉터리로 `Go Live` 실행

## Syntax

Markdown 문법은 다음 사이트를 참고하였다.

- [Basic Syntax](https://www.markdownguide.org/basic-syntax/)
- [Extended Syntax](https://www.markdownguide.org/extended-syntax/)

Basic syntax와 Extended syntax를 순차적으로 구현하는 방식으로 제작하였다.
우선, Basic Syntax를 정리하면 다음 표와 같다.

#### Basic Syntax

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
|                     | LINK REFERENCE  | `text`, `href`, `title` | `<a>`          | Inline    |        | V    |
| Images              | IMAGE           | `alt`, `src`            | `<img>`        | Inline    |        | V    |
| Escaping Characters | ESCAPE_PROTECT  |                         |                | Inline    |        | V    |
|                     | ESCAPE_RESTORE  |                         |                | Inline    |        | V    |
| HTML                | HTML            |                         |                | Block     |        | V    |

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

### Blockqoutes

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
