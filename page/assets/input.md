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
        - item3
        
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

### Headings

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

### Setext Headings

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
[  ]::::[100%:8px:3]
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
[  ]::::[100%:8px:3 2 1]
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
[  ]::::[100%:8px:3]{height: 12rem;}
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
        [' ]{width: 50%} ![](assets/test.jpg)
        ['']{width: 50%} ![](assets/test.jpg)
        [ ']{width: 50%} ![](assets/test.jpg)
        [: ]{width: 50%} ![](assets/test.jpg)
        [::]{width: 50%} ![](assets/test.jpg)
        [ :]{width: 50%} ![](assets/test.jpg)
        [. ]{width: 50%} ![](assets/test.jpg)
        [..]{width: 50%} ![](assets/test.jpg)
        [ .]{width: 50%} ![](assets/test.jpg)
[  ]::::[100%:8px:3]{height: 24rem;}
    [' ]{width: 50%} ![](assets/test.jpg)
    ['']{width: 50%} ![](assets/test.jpg)
    [ ']{width: 50%} ![](assets/test.jpg)
    [: ]{width: 50%} ![](assets/test.jpg)
    [::]{width: 50%} ![](assets/test.jpg)
    [ :]{width: 50%} ![](assets/test.jpg)
    [. ]{width: 50%} ![](assets/test.jpg)
    [..]{width: 50%} ![](assets/test.jpg)
    [ .]{width: 50%} ![](assets/test.jpg)
    
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
[  ]::::[100%:4px:10]
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
[  ]====[100%:8px]
    [  ]![](assets/test.jpg)
    [  ]![](assets/test_H.jpg)
    [  ]![](assets/test_V.jpg)
    [  ]![](assets/test.gif)

---

### Justified Row with Grid

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
[  ]::::[100%:8px:1]
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

---