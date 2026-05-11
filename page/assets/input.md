# Markdown Test Page {#markdown-test-page}

## Table of Contents

### [Basic Syntax](#basic-syntax)
::::[100%:8px:2]
[  ]- Block
        - [Blockquote](#blockquote)
        - [Code Block](#code-block)
        - [List](#list)
        - [Paragraph](#paragraph)
        - [Headings-ATX](#headings-atx)
        - [Headings-Setext](#headings-setext)
        - [Horizontal Rule](#horizontal-rule)
        - [HTML](#html)
        - [Link Reference](#link-reference)
[  ]- Inline
        - [Hard Break](#hard-break)
        - [Soft Break](#soft-break)
        - [Escape](#escape)
        - [Code](#code)
        - [Image](#image)
        - [Link](#link)
        - [Link Citation](#link-citation)
        - [Autolink-URL](#autolink-url)
        - [Autolink-Email](#autolink-email)
        - [Emphasis](#emphasis)

### [Extended Syntax](#extended-syntax)
::::[100%:8px:2]
[  ]- Block
        - [Fenced Code Block](#fenced-code-block)
        - [Heading-ATX-ID](#heading-atx-id)
        - [Table](#table)
[  ]- Inline
        - None
        
### [Custom Syntax](#custom-syntax)
::::[100%:8px:2]
[  ]- Block
        - [Grid](#grid)
        - [Grid Table](#grid-table)
        - [Justified Row](#justified-row)
[  ]- Inline
        - [Image Style](#image-style)
    
---

## Basic Syntax {#basic-syntax}

### Blockquote {#blockquote}

::::[100%:8px:2]
[  ]    > This is a blockquote.
        > It can span multiple lines.
        > 
        > - It can contain lists
        > - And other markdown elements
[  ]> This is a blockquote.
    > It can span multiple lines.
    > 
    > - It can contain lists
    > - And other markdown elements
    
---

### Code Block {#code-block}

    #include <iostream>
    
    int main() {
        std::cout << "Hello, World!" << std::endl;
        return 0;
    }

---

### List {#list}

::::[100%:8px:2]
[  ]    1. item1
            - item1-1
            - item1-2
        1. item2
            1. item2-1
            1. item2-2
                - item2-2-1
                - item2-2-2
        1. item3
[  ]1. item1
        - item1-1
        - item1-2
    1. item2
        1. item2-1
        1. item2-2
            - item2-2-1
            - item2-2-2
    1. item3

---

### Paragraph {#paragraph}

::::[100%:8px:2]
[  ]    This is a paragraph. It can contain multiple sentences. 
        It will be rendered as a single block of text.
[  ]This is a paragraph. It can contain multiple sentences. 
    It will be rendered as a single block of text.
    
---

### Headings-ATX {#headings-atx}

::::[100%:8px:2]
[  ]    # Heading Level 1
        ## Heading Level 2
        ### Heading Level 3
        #### Heading Level 4
        ##### Heading Level 5
        ###### Heading Level 6
[  ]# Heading Level 1
    ## Heading Level 2
    ### Heading Level 3
    #### Heading Level 4
    ##### Heading Level 5
    ###### Heading Level 6

---

### Headings-Setext {#headings-setext}

::::[100%:8px:2]
[  ]    Heading Level 1
        ===============
        
        Heading Level 2
        ---------------
[  ]Heading Level 1
    ================
    
    Heading Level 2
    ----------------

---

### Horizontal Rule {#horizontal-rule}
::::[100%:8px:2]
[  ]    ---
        ***
        ___
[  ]---
    ***
    ___
    
### HTML {#html}

::::[100%:8px:2]
[  ]    <div>
            <h4>두 번째 HTML 블록</h4>
            <p>첫 번째 HTML 블록입니다.</p>
            <strong>굵은 텍스트</strong>
        </div>
        <br>
        <section>
            <h4>두 번째 HTML 블록</h4>
            <p>두 번째 HTML 블록입니다.</p>
        </section>
[  ]<div>
        <h4>두 번째 HTML 블록</h4>
        <p>첫 번째 HTML 블록입니다.</p>
        <strong>굵은 텍스트</strong>
    </div>
    <br>
    <section>
        <h4>두 번째 HTML 블록</h4>
        <p>두 번째 HTML 블록입니다.</p>
    </section>

---

### Link Reference {#link-reference}

::::[100%:8px:2]
[  ]    [Google][Google]
        
        [Google]: https://www.google.com 
[  ][Google][Google]
    
    [Google]: https://www.google.com 
---

### Hard Break {#hard-break}

::::[100%:8px:2]
[  ]    This is a line with a hard break.  
        This is the next line.
[  ]This is a line with a hard break.  
    This is the next line.
    
::::[100%:8px:2]
[  ]    This is a line with a hard break.\
        This is the next line.
[  ]This is a line with a hard break.\
    This is the next line.

---

### Soft Break {#soft-break}

::::[100%:8px:2]
[  ]    This is a line with a soft break.
        This is the next line.
[  ]This is a line with a soft break.
    This is the next line.

---

### Escape {#escape}

::::[100%:8px:2]
[  ]    This is a backslash: \\  
        This is a literal asterisk: \*  
        This is a literal underscore: \_
[  ]This is a backslash: \\  
    This is a literal asterisk: \*  
    This is a literal underscore: \_

---

### Code {#code}

::::[100%:8px:2]
[  ]    This is a code span: `code`\
        This is a code span: ``code`code`code``
[  ]This is a code span: `code`\
    This is a code span: ``code`code`code``

---

### Image {#image}

::::[100%:8px:2]
[  ]    ![IMAGE](assets/test.jpg)
[  ]![IMAGE](assets/test.jpg)

---

### Link {#link}

::::[100%:8px:2]
[  ]    [Google](https://www.google.com)
[  ][Google](https://www.google.com)

---

### Link Citation {#link-citation}

::::[100%:8px:2]
[  ]    [Google][Google]
        
        [Google]: https://www.google.com "Google"
[  ][Google][Google]
    
    [Google]: https://www.google.com "Google"

---

### Autolink-URL {#autolink-url}

::::[100%:8px:2]
[  ]    <https://www.google.com>
[  ]<https://www.google.com>

---

### Autolink-Email {#autolink-email}

::::[100%:8px:2]
[  ]    <user@example.com>
[  ]<user@example.com>

---

### Emphasis {#emphasis}

::::[100%:8px:2]
[  ]    **Bold *bold&italic* Bold**
        
        __Bold__
        
        *Italic*
        
        _Italic_
        
        ***Bold and Italic 0***
        
        ___Bold and Italic 1___
        
        **_Bold and Italic 2_**
        
        __*Bold and Italic 3*__
        
        *__Bold and Italic 4__*
        
        _**Bold and Italic 5**_
        
        A__not bold not italic__
        
        __not bold not italic__A  
        
        A__not bold not italic__A
        
        A_not bold not italic_  
        
        _not bold not italic_A  
        
        A_not bold not italic_A
[  ]**Bold *bold&italic* Bold**
    
    __Bold__
    
    *Italic*
    
    _Italic_
    
    ***Bold and Italic 0***
    
    ___Bold and Italic 1___
    
    **_Bold and Italic 2_**
    
    __*Bold and Italic 3*__
    
    *__Bold and Italic 4__*
    
    _**Bold and Italic 5**_
    
    A__not bold not italic__
    
    __not bold not italic__A  
    
    A__not bold not italic__A
    
    A_not bold not italic_  
    
    _not bold not italic_A  
    
    A_not bold not italic_A

---

## Extended Syntax {#extended-syntax}

### Fenced Code Block {#fenced-code-block}

::::[100%:8px:2]
[  ]    ```cpp
        #include <iostream>
        
        int main(int argc, char* argv[]) {
          std::cout << "Hello, Markdown!" << std::endl;
          return 0;
        }
        ```
[  ]```cpp
    #include <iostream>
    
    int main(int argc, char* argv[]) {
        std::cout << "Hello, Markdown!" << std::endl;
        return 0;
    }
    ```

---

### Heading-ATX-ID {#heading-atx-id}

::::[100%:8px:2]
[  ]    # Heading Level 1 {#heading-level-1}
        ## Heading Level 2 {#heading-level-2}
        ### Heading Level 3 {#heading-level-3}
        #### Heading Level 4 {#heading-level-4}
        ##### Heading Level 5 {#heading-level-5}
        ###### Heading Level 6 {#heading-level-6}
        
        [Heading Level 1](#heading-level-1)\
        [Heading Level 2](#heading-level-2)\
        [Heading Level 3](#heading-level-3)\
        [Heading Level 4](#heading-level-4)\
        [Heading Level 5](#heading-level-5)\
        [Heading Level 6](#heading-level-6)\
[  ]# Heading Level 1 {#heading-level-1}
    ## Heading Level 2 {#heading-level-2}
    ### Heading Level 3 {#heading-level-3}
    #### Heading Level 4 {#heading-level-4}
    ##### Heading Level 5 {#heading-level-5}
    ###### Heading Level 6 {#heading-level-6}
    
    [Heading Level 1](#heading-level-1)\
    [Heading Level 2](#heading-level-2)\
    [Heading Level 3](#heading-level-3)\
    [Heading Level 4](#heading-level-4)\
    [Heading Level 5](#heading-level-5)\
    [Heading Level 6](#heading-level-6)\

---

### Table {#table}

::::[100%:8px:1]
[  ]    | Header 1 | Header 2 | Header 3 | Header 4 |
        |----------|:---------|:--------:|---------:|
        | Cell 1   | Cell 2   | Cell 3   | Cell 4   |
        | Cell 5   | Cell 6   | Cell 7   | Cell 8   |
[  ]| Header 1 | Header 2 | Header 3 | Header 4 |
    |----------|:---------|:--------:|---------:|
    | Cell 1   | Cell 2   | Cell 3   | Cell 4   |
    | Cell 5   | Cell 6   | Cell 7   | Cell 8   |

---

## Custom Syntax {#custom-syntax}

### Grid {#grid}

#### Columns

::::[100%:8px:2]
[  ]    ::::[100%:8px:3]
        [  ] ![IMAGE](assets/test.jpg)
        [  ] ![IMAGE](assets/test.jpg)
        [  ] ![IMAGE](assets/test.jpg)
        [  ] ![IMAGE](assets/test.jpg)
        [  ] ![IMAGE](assets/test.jpg)
        [  ] ![IMAGE](assets/test.jpg)
[' ]::::[100%:8px:3]
    [  ] ![IMAGE](assets/test.jpg)
    [  ] ![IMAGE](assets/test.jpg)
    [  ] ![IMAGE](assets/test.jpg)
    [  ] ![IMAGE](assets/test.jpg)
    [  ] ![IMAGE](assets/test.jpg)
    [  ] ![IMAGE](assets/test.jpg)

::::[100%:8px:2]
[  ]    ::::[100%:8px:3 2 1]
        [  ] ![IMAGE](assets/test.jpg)
        [  ] ![IMAGE](assets/test.jpg)
        [  ] ![IMAGE](assets/test.jpg)
        [  ] ![IMAGE](assets/test.jpg)
        [  ] ![IMAGE](assets/test.jpg)
        [  ] ![IMAGE](assets/test.jpg)
[' ]::::[100%:8px:3 2 1]
    [  ] ![IMAGE](assets/test.jpg)
    [  ] ![IMAGE](assets/test.jpg)
    [  ] ![IMAGE](assets/test.jpg)
    [  ] ![IMAGE](assets/test.jpg)
    [  ] ![IMAGE](assets/test.jpg)
    [  ] ![IMAGE](assets/test.jpg)

#### Alignment

::::[100%:8px:2]
[  ]    ::::[100%:8px:3]{height: 12rem;}
        [' ] Top Left
        [''] Top Center
        [ '] Top Right
        [: ] Middle Left
        [::] Middle Center
        [ :] Middle Right
        [. ] Bottom Left
        [..] Bottom Center
        [ .] Bottom Right
[' ]::::[100%:8px:3]{height: 12rem;}
    [' ] Top Left
    [''] Top Center
    [ '] Top Right
    [: ] Middle Left
    [::] Middle Center
    [ :] Middle Right
    [. ] Bottom Left
    [..] Bottom Center
    [ .] Bottom Right
    
[  ]    ::::[100%:8px:3]{height: 24rem;}
        [' ] ![IMAGE](assets/test.jpg){width: 50%}
        [''] ![IMAGE](assets/test.jpg){width: 50%}
        [ '] ![IMAGE](assets/test.jpg){width: 50%}
        [: ] ![IMAGE](assets/test.jpg){width: 50%}
        [::] ![IMAGE](assets/test.jpg){width: 50%}
        [ :] ![IMAGE](assets/test.jpg){width: 50%}
        [. ] ![IMAGE](assets/test.jpg){width: 50%}
        [..] ![IMAGE](assets/test.jpg){width: 50%}
        [ .] ![IMAGE](assets/test.jpg){width: 50%}
[' ]::::[100%:8px:3]{height: 24rem;}
    [' ] ![IMAGE](assets/test.jpg){width: 50%}
    [''] ![IMAGE](assets/test.jpg){width: 50%}
    [ '] ![IMAGE](assets/test.jpg){width: 50%}
    [: ] ![IMAGE](assets/test.jpg){width: 50%}
    [::] ![IMAGE](assets/test.jpg){width: 50%}
    [ :] ![IMAGE](assets/test.jpg){width: 50%}
    [. ] ![IMAGE](assets/test.jpg){width: 50%}
    [..] ![IMAGE](assets/test.jpg){width: 50%}
    [ .] ![IMAGE](assets/test.jpg){width: 50%}
    
#### Mosaic

::::[100%:8px:2]
[  ]    ::::[100%:4px:10]
        [  ]![IMAGE](assets/test.jpg)
        [  ]
        [  ]
        [  ]
        [  ]![IMAGE](assets/test.gif)
        [  ]
        [  ]![IMAGE](assets/test.jpg)
        [  ]![IMAGE](assets/test.gif)
        [  ]![IMAGE](assets/test.jpg)
        [  ]
        [  ]![IMAGE](assets/test.gif)
        [  ]![IMAGE](assets/test.jpg)
        [  ]
        [  ]![IMAGE](assets/test.gif)
        [  ]![IMAGE](assets/test.jpg)
        [  ]
        [  ]![IMAGE](assets/test.gif)
        [  ]
        [  ]
        [  ]![IMAGE](assets/test.jpg)
        [  ]![IMAGE](assets/test.gif)
        [  ]
        [  ]![IMAGE](assets/test.jpg)
        [  ]
        [  ]![IMAGE](assets/test.gif)
        [  ]
        [  ]![IMAGE](assets/test.jpg)
        [  ]![IMAGE](assets/test.gif)
        [  ]![IMAGE](assets/test.jpg)
        [  ]
        [  ]![IMAGE](assets/test.gif)
        [  ]
        [  ]![IMAGE](assets/test.jpg)
        [  ]
        [  ]![IMAGE](assets/test.gif)
        [  ]
        [  ]![IMAGE](assets/test.jpg)
        [  ]
        [  ]
        [  ]![IMAGE](assets/test.gif)
        [  ]![IMAGE](assets/test.jpg)
        [  ]
        [  ]![IMAGE](assets/test.gif)
        [  ]
        [  ]![IMAGE](assets/test.jpg)
        [  ]
        [  ]![IMAGE](assets/test.gif)
        [  ]
        [  ]
        [  ]![IMAGE](assets/test.jpg)
[' ]::::[100%:4px:10]
    [  ]![IMAGE](assets/test.jpg)
    [  ]
    [  ]
    [  ]
    [  ]![IMAGE](assets/test.gif)
    [  ]
    [  ]![IMAGE](assets/test.jpg)
    [  ]![IMAGE](assets/test.gif)
    [  ]![IMAGE](assets/test.jpg)
    [  ]
    [  ]![IMAGE](assets/test.gif)
    [  ]![IMAGE](assets/test.jpg)
    [  ]
    [  ]![IMAGE](assets/test.gif)
    [  ]![IMAGE](assets/test.jpg)
    [  ]
    [  ]![IMAGE](assets/test.gif)
    [  ]
    [  ]
    [  ]![IMAGE](assets/test.jpg)
    [  ]![IMAGE](assets/test.gif)
    [  ]
    [  ]![IMAGE](assets/test.jpg)
    [  ]
    [  ]![IMAGE](assets/test.gif)
    [  ]
    [  ]![IMAGE](assets/test.jpg)
    [  ]![IMAGE](assets/test.gif)
    [  ]![IMAGE](assets/test.jpg)
    [  ]
    [  ]![IMAGE](assets/test.gif)
    [  ]
    [  ]![IMAGE](assets/test.jpg)
    [  ]
    [  ]![IMAGE](assets/test.gif)
    [  ]
    [  ]![IMAGE](assets/test.jpg)
    [  ]
    [  ]
    [  ]![IMAGE](assets/test.gif)
    [  ]![IMAGE](assets/test.jpg)
    [  ]
    [  ]![IMAGE](assets/test.gif)
    [  ]
    [  ]![IMAGE](assets/test.jpg)
    [  ]
    [  ]![IMAGE](assets/test.gif)
    [  ]
    [  ]
    [  ]![IMAGE](assets/test.jpg)
    
---

### Grid Table {#grid-table}

::::[100%:8px:1]
[  ]    +-------+-------+-------+-------+-------+-------+--------+ 
        | Grid Table Test                                        | 
        +:======================================================:+ 
        | Left Top      | Center Top    | Right Top     | Item1  |
        |               |               |               |:-------| 
        |               |               |               | Item2  |
        |'--------------+'-------------'+--------------'+:------:+
        | Left Middle   | Center Middle | Right Middle  | Item3  |
        |               |               |               |-------:|
        |               |               |               | Item4  |
        |:--------------+:-------------:+--------------:|.------.|
        | Left Bottom   | Center Bottom | Right Bottom  | Item5  |
        |               |               |               |.-------|
        |               |               |               | Header |
        |.------+-------+.------+------.+--------------.|:======:|
        |       |       |       |       |       |       |        |
        |-------+-------+-------+-------+-------+-------|        |
        |  Merged Cell  |       |         Merged\       |        |
        |-------+-------+-------|   Header              |--------|
        |       |  Merged Cell  |       Cell            |        |
        +-------+---------------+:=====================:+--------+
[  ]+-------+-------+-------+-------+-------+-------+--------+ 
    | Grid Table Test                                        | 
    +:======================================================:+ 
    | Left Top      | Center Top    | Right Top     | Item1  |
    |               |               |               |:-------| 
    |               |               |               | Item2  |
    |'--------------+'-------------'+--------------'+:------:+
    | Left Middle   | Center Middle | Right Middle  | Item3  |
    |               |               |               |-------:|
    |               |               |               | Item4  |
    |:--------------+:-------------:+--------------:|.------.|
    | Left Bottom   | Center Bottom | Right Bottom  | Item5  |
    |               |               |               |.-------|
    |               |               |               | Header |
    |.------+-------+.------+------.+--------------.|:======:|
    |       |       |       |       |       |       |        |
    |-------+-------+-------+-------+-------+-------|        |
    |  Merged Cell  |       |         Merged\       |        |
    |-------+-------+-------|   Header              |--------|
    |       |  Merged Cell  |       Cell            |        |
    +-------+---------------+:=====================:+--------+

---

### Justified Row

::::[100%:8px:2]
[  ]    ====[100%:8px]
        [  ]![IMAGE](assets/test.jpg)
        [  ]![IMAGE](assets/test_H.jpg)
        [  ]![IMAGE](assets/test_V.jpg)
        [  ]![IMAGE](assets/test.gif)
[' ]====[100%:8px]
    [  ]![IMAGE](assets/test.jpg)
    [  ]![IMAGE](assets/test_H.jpg)
    [  ]![IMAGE](assets/test_V.jpg)
    [  ]![IMAGE](assets/test.gif)

---

#### Justified Row with Grid

#### Justified Gallery
::::[100%:8px:2]
[  ]    ::::[100%:8px:1]
        [  ]====[100%:8px]
            [  ]![IMAGE](assets/test.jpg)
            [  ]![IMAGE](assets/test_H.jpg)
            [  ]![IMAGE](assets/test_V.jpg)
            [  ]![IMAGE](assets/test.gif)
        [  ]====[100%:8px]
            [  ]![IMAGE](assets/test_H.jpg)
            [  ]![IMAGE](assets/test.jpg)
            [  ]![IMAGE](assets/test.gif)
        [  ]====[100%:8px]
            [  ]![IMAGE](assets/test.gif)
            [  ]![IMAGE](assets/test_H.jpg)
            [  ]![IMAGE](assets/test_V.jpg)
[' ]::::[100%:8px:1]
    [  ]====[100%:8px]
        [  ]![IMAGE](assets/test.jpg)
        [  ]![IMAGE](assets/test_H.jpg)
        [  ]![IMAGE](assets/test_V.jpg)
        [  ]![IMAGE](assets/test.gif)
    [  ]====[100%:8px]
        [  ]![IMAGE](assets/test_H.jpg)
        [  ]![IMAGE](assets/test.jpg)
        [  ]![IMAGE](assets/test.gif)
    [  ]====[100%:8px]
        [  ]![IMAGE](assets/test.gif)
        [  ]![IMAGE](assets/test_H.jpg)
        [  ]![IMAGE](assets/test_V.jpg)

#### Aligned Justified Gallery

::::[100%:8px:2]
[  ]    ::::[100%:8px:1]
        [: ]====[80%:8px]
            [  ]![IMAGE](assets/test.jpg)
            [  ]![IMAGE](assets/test_H.jpg)
            [  ]![IMAGE](assets/test_V.jpg)
            [  ]![IMAGE](assets/test.gif)
        [ :]====[80%:8px]
            [  ]![IMAGE](assets/test_H.jpg)
            [  ]![IMAGE](assets/test.jpg)
            [  ]![IMAGE](assets/test.gif)
        [::]====[80%:8px]
            [  ]![IMAGE](assets/test.gif)
            [  ]![IMAGE](assets/test_H.jpg)
            [  ]![IMAGE](assets/test_V.jpg)
[' ]::::[100%:8px:1]
    [: ]====[80%:8px]
        [  ]![IMAGE](assets/test.jpg)
        [  ]![IMAGE](assets/test_H.jpg)
        [  ]![IMAGE](assets/test_V.jpg)
        [  ]![IMAGE](assets/test.gif)
    [ :]====[80%:8px]
        [  ]![IMAGE](assets/test_H.jpg)
        [  ]![IMAGE](assets/test.jpg)
        [  ]![IMAGE](assets/test.gif)
    [::]====[80%:8px]
        [  ]![IMAGE](assets/test.gif)
        [  ]![IMAGE](assets/test_H.jpg)
        [  ]![IMAGE](assets/test_V.jpg)

---

### Image Style {#image-style}

::::[100%:8px:2]
[  ]    ![IMAGE](assets/test.jpg){width: 50%}
[  ]![IMAGE](assets/test.jpg){width: 50%}

---