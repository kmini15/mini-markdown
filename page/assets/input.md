# Markdown Test Page

## Basic Syntax

### Blockquote

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

### Code Block

    #include <iostream>
    
    int main() {
        std::cout << "Hello, World!" << std::endl;
        return 0;
    }

---

### List

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

### Paragraph

::::[100%:8px:2]
[  ]    This is a paragraph. It can contain multiple sentences. 
        It will be rendered as a single block of text.
[  ]This is a paragraph. It can contain multiple sentences. 
    It will be rendered as a single block of text.
    
---

### Headings - ATX Style

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

### Headings - Setext Style

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

### Horizontal Rule
::::[100%:8px:2]
[  ]    ---
        ***
        ___
[  ]---
    ***
    ___
    
### HTML

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

### Link Reference

::::[100%:8px:2]
[  ]    [Google][Google]
        
        [Google]: https://www.google.com 
[  ][Google][Google]
    
    [Google]: https://www.google.com 
---

### Hard Break

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

### Soft Break

::::[100%:8px:2]
[  ]    This is a line with a soft break.
        This is the next line.
[  ]This is a line with a soft break.
    This is the next line.

---

### Escape

::::[100%:8px:2]
[  ]    This is a backslash: \\  
        This is a literal asterisk: \*  
        This is a literal underscore: \_
[  ]This is a backslash: \\  
    This is a literal asterisk: \*  
    This is a literal underscore: \_

---

### Code

::::[100%:8px:2]
[  ]    This is a code span: `code`
[  ]This is a code span: `code`

---

### Image

::::[100%:8px:2]
[  ]    ![Alt Text](assets/test.jpg)
[  ]![Alt Text](assets/test.jpg)

---

### Link

::::[100%:8px:2]
[  ]    [Google](https://www.google.com)
[  ][Google](https://www.google.com)

---

### Link Citation

::::[100%:8px:2]
[  ]    [Google][Google]
        
        [Google]: https://www.google.com "Google"
[  ][Google][Google]
    
    [Google]: https://www.google.com "Google"

---

### Autolink-URL

::::[100%:8px:2]
[  ]    <https://www.google.com>
[  ]<https://www.google.com>

---

### Autolink-Email

::::[100%:8px:2]
[  ]    <user@example.com>
[  ]<user@example.com>

---

### Emphasis

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

## Custom Syntax

### Grid

#### Columns

::::[100%:8px:2]
[  ]    ::::[100%:8px:3]
        [  ] ![](assets/test.jpg)
        [  ] ![](assets/test.jpg)
        [  ] ![](assets/test.jpg)
        [  ] ![](assets/test.jpg)
        [  ] ![](assets/test.jpg)
        [  ] ![](assets/test.jpg)
[' ]::::[100%:8px:3]
    [  ] ![](assets/test.jpg)
    [  ] ![](assets/test.jpg)
    [  ] ![](assets/test.jpg)
    [  ] ![](assets/test.jpg)
    [  ] ![](assets/test.jpg)
    [  ] ![](assets/test.jpg)

::::[100%:8px:2]
[  ]    ::::[100%:8px:3 2 1]
        [  ] ![](assets/test.jpg)
        [  ] ![](assets/test.jpg)
        [  ] ![](assets/test.jpg)
        [  ] ![](assets/test.jpg)
        [  ] ![](assets/test.jpg)
        [  ] ![](assets/test.jpg)
[' ]::::[100%:8px:3 2 1]
    [  ] ![](assets/test.jpg)
    [  ] ![](assets/test.jpg)
    [  ] ![](assets/test.jpg)
    [  ] ![](assets/test.jpg)
    [  ] ![](assets/test.jpg)
    [  ] ![](assets/test.jpg)

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
        [' ] ![](assets/test.jpg){width: 50%}
        [''] ![](assets/test.jpg){width: 50%}
        [ '] ![](assets/test.jpg){width: 50%}
        [: ] ![](assets/test.jpg){width: 50%}
        [::] ![](assets/test.jpg){width: 50%}
        [ :] ![](assets/test.jpg){width: 50%}
        [. ] ![](assets/test.jpg){width: 50%}
        [..] ![](assets/test.jpg){width: 50%}
        [ .] ![](assets/test.jpg){width: 50%}
[' ]::::[100%:8px:3]{height: 24rem;}
    [' ] ![](assets/test.jpg){width: 50%}
    [''] ![](assets/test.jpg){width: 50%}
    [ '] ![](assets/test.jpg){width: 50%}
    [: ] ![](assets/test.jpg){width: 50%}
    [::] ![](assets/test.jpg){width: 50%}
    [ :] ![](assets/test.jpg){width: 50%}
    [. ] ![](assets/test.jpg){width: 50%}
    [..] ![](assets/test.jpg){width: 50%}
    [ .] ![](assets/test.jpg){width: 50%}
    
#### Mosaic

::::[100%:8px:2]
[  ]    ::::[100%:4px:10]
        [  ]![](assets/test.jpg)
        [  ]
        [  ]
        [  ]
        [  ]![](assets/test.gif)
        [  ]
        [  ]![](assets/test.jpg)
        [  ]![](assets/test.gif)
        [  ]![](assets/test.jpg)
        [  ]
        [  ]![](assets/test.gif)
        [  ]![](assets/test.jpg)
        [  ]
        [  ]![](assets/test.gif)
        [  ]![](assets/test.jpg)
        [  ]
        [  ]![](assets/test.gif)
        [  ]
        [  ]
        [  ]![](assets/test.jpg)
        [  ]![](assets/test.gif)
        [  ]
        [  ]![](assets/test.jpg)
        [  ]
        [  ]![](assets/test.gif)
        [  ]
        [  ]![](assets/test.jpg)
        [  ]![](assets/test.gif)
        [  ]![](assets/test.jpg)
        [  ]
        [  ]![](assets/test.gif)
        [  ]
        [  ]![](assets/test.jpg)
        [  ]
        [  ]![](assets/test.gif)
        [  ]
        [  ]![](assets/test.jpg)
        [  ]
        [  ]
        [  ]![](assets/test.gif)
        [  ]![](assets/test.jpg)
        [  ]
        [  ]![](assets/test.gif)
        [  ]
        [  ]![](assets/test.jpg)
        [  ]
        [  ]![](assets/test.gif)
        [  ]
        [  ]
        [  ]![](assets/test.jpg)
[' ]::::[100%:4px:10]
    [  ]![](assets/test.jpg)
    [  ]
    [  ]
    [  ]
    [  ]![](assets/test.gif)
    [  ]
    [  ]![](assets/test.jpg)
    [  ]![](assets/test.gif)
    [  ]![](assets/test.jpg)
    [  ]
    [  ]![](assets/test.gif)
    [  ]![](assets/test.jpg)
    [  ]
    [  ]![](assets/test.gif)
    [  ]![](assets/test.jpg)
    [  ]
    [  ]![](assets/test.gif)
    [  ]
    [  ]
    [  ]![](assets/test.jpg)
    [  ]![](assets/test.gif)
    [  ]
    [  ]![](assets/test.jpg)
    [  ]
    [  ]![](assets/test.gif)
    [  ]
    [  ]![](assets/test.jpg)
    [  ]![](assets/test.gif)
    [  ]![](assets/test.jpg)
    [  ]
    [  ]![](assets/test.gif)
    [  ]
    [  ]![](assets/test.jpg)
    [  ]
    [  ]![](assets/test.gif)
    [  ]
    [  ]![](assets/test.jpg)
    [  ]
    [  ]
    [  ]![](assets/test.gif)
    [  ]![](assets/test.jpg)
    [  ]
    [  ]![](assets/test.gif)
    [  ]
    [  ]![](assets/test.jpg)
    [  ]
    [  ]![](assets/test.gif)
    [  ]
    [  ]
    [  ]![](assets/test.jpg)
    
---

### Justified Row

::::[100%:8px:2]
[  ]    ====[100%:8px]
        [  ]![](assets/test.jpg)
        [  ]![](assets/test_H.jpg)
        [  ]![](assets/test_V.jpg)
        [  ]![](assets/test.gif)
[' ]====[100%:8px]
    [  ]![](assets/test.jpg)
    [  ]![](assets/test_H.jpg)
    [  ]![](assets/test_V.jpg)
    [  ]![](assets/test.gif)

---

### Justified Row with Grid

#### Justified Gallery
::::[100%:8px:2]
[  ]    ::::[100%:8px:1]
        [  ]====[100%:8px]
            [  ]![](assets/test.jpg)
            [  ]![](assets/test_H.jpg)
            [  ]![](assets/test_V.jpg)
            [  ]![](assets/test.gif)
        [  ]====[100%:8px]
            [  ]![](assets/test_H.jpg)
            [  ]![](assets/test.jpg)
            [  ]![](assets/test.gif)
        [  ]====[100%:8px]
            [  ]![](assets/test.gif)
            [  ]![](assets/test_H.jpg)
            [  ]![](assets/test_V.jpg)
[' ]::::[100%:8px:1]
    [  ]====[100%:8px]
        [  ]![](assets/test.jpg)
        [  ]![](assets/test_H.jpg)
        [  ]![](assets/test_V.jpg)
        [  ]![](assets/test.gif)
    [  ]====[100%:8px]
        [  ]![](assets/test_H.jpg)
        [  ]![](assets/test.jpg)
        [  ]![](assets/test.gif)
    [  ]====[100%:8px]
        [  ]![](assets/test.gif)
        [  ]![](assets/test_H.jpg)
        [  ]![](assets/test_V.jpg)

#### Aligned Justified Gallery

::::[100%:8px:2]
[  ]    ::::[100%:8px:1]
        [: ]====[80%:8px]
            [  ]![](assets/test.jpg)
            [  ]![](assets/test_H.jpg)
            [  ]![](assets/test_V.jpg)
            [  ]![](assets/test.gif)
        [ :]====[80%:8px]
            [  ]![](assets/test_H.jpg)
            [  ]![](assets/test.jpg)
            [  ]![](assets/test.gif)
        [::]====[80%:8px]
            [  ]![](assets/test.gif)
            [  ]![](assets/test_H.jpg)
            [  ]![](assets/test_V.jpg)
[' ]::::[100%:8px:1]
    [: ]====[80%:8px]
        [  ]![](assets/test.jpg)
        [  ]![](assets/test_H.jpg)
        [  ]![](assets/test_V.jpg)
        [  ]![](assets/test.gif)
    [ :]====[80%:8px]
        [  ]![](assets/test_H.jpg)
        [  ]![](assets/test.jpg)
        [  ]![](assets/test.gif)
    [::]====[80%:8px]
        [  ]![](assets/test.gif)
        [  ]![](assets/test_H.jpg)
        [  ]![](assets/test_V.jpg)

---

### Grid Table

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